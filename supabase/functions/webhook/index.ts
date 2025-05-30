
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    const body = await req.json();
    console.log('Webhook received:', JSON.stringify(body, null, 2));

    // Validar estructura básica
    if (!body.type || !body.data) {
      return new Response(
        JSON.stringify({ error: 'Invalid payload: type and data are required' }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Guardar en webhook_data para auditoría
    const { data: webhookData, error: webhookError } = await supabase
      .from('webhook_data')
      .insert([{
        type: body.type,
        data: body.data,
        processed: false
      }])
      .select()
      .single();

    if (webhookError) {
      console.error('Error saving webhook data:', webhookError);
      return new Response(
        JSON.stringify({ error: 'Failed to save webhook data' }),
        { 
          status: 500, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Procesar según el tipo
    if (body.type === 'call') {
      // Validar campos obligatorios para llamadas
      const { data } = body;
      if (!data.time || typeof data.duration !== 'number' || typeof data.cost !== 'number' || !data.result) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: time, duration, cost, result' }),
          { 
            status: 400, 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        );
      }

      // Validar que result sea un valor válido
      const validResults = ['success', 'failed', 'no_answer', 'busy'];
      if (!validResults.includes(data.result)) {
        return new Response(
          JSON.stringify({ error: `Invalid result. Must be one of: ${validResults.join(', ')}` }),
          { 
            status: 400, 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        );
      }

      // Insertar llamada directamente
      const callData = {
        call_id: data.call_id || null,
        client_id: data.client_id || null,
        client_name: data.client_name || null,
        time: data.time,
        duration: parseInt(data.duration) || 0,
        type: data.type || null,
        cost: parseFloat(data.cost) || 0,
        disconnection_reason: data.disconnection_reason || null,
        result: data.result,
        user_sentiment: data.user_sentiment || null,
        from_number: data.from_number || null,
        to_number: data.to_number || null,
        call_successful: data.call_successful !== undefined ? Boolean(data.call_successful) : null,
        call_summary: data.call_summary || null,
        service_id: data.service_id || null,
        service_name: data.service_name || null,
        recording: data.recording || null,
        transcription: data.transcription || null
      };

      const { data: callResult, error: callError } = await supabase
        .from('calls')
        .insert([callData])
        .select()
        .single();

      if (callError) {
        console.error('Error inserting call:', callError);
        return new Response(
          JSON.stringify({ error: 'Failed to insert call data', details: callError.message }),
          { 
            status: 500, 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        );
      }

      // Marcar webhook como procesado
      await supabase
        .from('webhook_data')
        .update({ processed: true })
        .eq('id', webhookData.id);

      console.log('Call inserted successfully:', callResult.id);

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Call data processed successfully',
          call_id: callResult.id,
          webhook_id: webhookData.id
        }),
        { 
          status: 200, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Tipo no soportado
    return new Response(
      JSON.stringify({ error: `Unsupported webhook type: ${body.type}` }),
      { 
        status: 400, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
