
import { Card, CardContent } from "@/components/ui/card";
import { WebhookData } from "@/types";

interface WebhookStatsProps {
  webhookData: WebhookData[];
}

const WebhookStats = ({ webhookData }: WebhookStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{webhookData.length}</p>
            <p className="text-sm text-gray-600">Webhooks Recibidos</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {webhookData.filter(item => item.processed).length}
            </p>
            <p className="text-sm text-gray-600">Procesados</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {webhookData.filter(item => !item.processed).length}
            </p>
            <p className="text-sm text-gray-600">Pendientes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookStats;
