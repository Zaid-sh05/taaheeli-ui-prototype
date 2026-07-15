import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "./ConfirmDialog";
import { useDemoData } from "@/context/DemoDataContext";
import { useToast } from "@/context/ToastContext";
import { RotateCcw } from "lucide-react";

export function ResetDemoDataButton() {
  const { resetDemoData } = useDemoData();
  const { showToast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleConfirm() {
    resetDemoData();
    setConfirmOpen(false);
    showToast("تمت إعادة ضبط البيانات التجريبية بنجاح");
  }

  return (
    <>
      <Button variant="secondary" size="sm" onClick={() => setConfirmOpen(true)} leftIcon={<RotateCcw className="h-4 w-4" aria-hidden="true" />}>
        إعادة ضبط البيانات التجريبية
      </Button>
      <ConfirmDialog
        open={confirmOpen}
        title="إعادة ضبط البيانات التجريبية"
        message="سيتم استبدال جميع البيانات الحالية بالبيانات التجريبية الأصلية. لن يمكن التراجع عن هذا الإجراء. هل أنت متأكد؟"
        confirmLabel="إعادة الضبط"
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
