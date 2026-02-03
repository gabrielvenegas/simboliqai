import { Button } from "../ui/button";

export default function AddMoreCredit() {
  return (
    <Button
      variant="ghost"
      size="sm"
      // onClick={onBuyCredits}
      className="text-primary hover:text-primary hover:bg-primary/20"
    >
      Adicionar créditos
    </Button>
  );
}
