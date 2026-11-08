import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppIcon from '../../../base/ui/AppIcon';
import Button from '../../../base/ui/Button';

type QrResultCardProps = {
  result: string;
  onCreateTransaction: () => void;
};
const QrResultCard = (props: QrResultCardProps) => {
  const { result, onCreateTransaction } = props;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Thông tin đã đọc</CardTitle>
        <AppIcon name="qr-scan" size={20} />
      </CardHeader>
      <CardContent className="stack">
        <CardDescription className="small">
          Nội dung chưa được xác minh với ngân hàng. Vun Vén chưa thực hiện thanh toán.
        </CardDescription>
        <pre className="qr-result">{result}</pre>
        <Button onClick={onCreateTransaction}>Tôi đã thanh toán · Ghi tiền ra</Button>
      </CardContent>
    </Card>
  );
};
export default QrResultCard;
