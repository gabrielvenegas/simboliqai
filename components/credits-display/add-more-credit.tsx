import { Button } from "../ui/button";

export default function AddMoreCredit() {
  return (
    <Button
      variant="ghost"
      size="sm"
      // onClick={onBuyCredits}
      className="text-primary hover:text-primary-hover hover:bg-red-50"
    >
      Add Credits
    </Button>
  );
}
