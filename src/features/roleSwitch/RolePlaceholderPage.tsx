import { useNavigate } from "react-router-dom";
import { ROLES } from "@/config/roles";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useFocusOnMount } from "@/hooks/useFocusOnMount";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { useSession } from "@/context/SessionContext";
import { Construction } from "lucide-react";

export function RolePlaceholderPage() {
  useDocumentTitle("قيد التطوير");
  const navigate = useNavigate();
  const { session } = useSession();
  const headingRef = useFocusOnMount<HTMLHeadingElement>();
  const roleMeta = session ? ROLES[session.role] : null;

  return (
    <PageContainer className="py-10">
      <PageHeader title={roleMeta ? `واجهة ${roleMeta.label}` : "واجهة قيد التطوير"} />
      <h2 ref={headingRef} className="sr-only">
        صفحة قيد التطوير
      </h2>

      <Card>
        <div className="flex flex-col items-center text-center py-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-600 mb-4">
            <Construction className="h-8 w-8" aria-hidden="true" />
          </div>
          <Alert tone="info" title="هذه الواجهة قيد التطوير في مرحلة لاحقة" className="max-w-prose">
            ستتوفر واجهة <strong>{roleMeta?.label ?? "هذا الدور"}</strong> بشكل كامل في مرحلة قادمة.
            حالياً يمكنك تجربة واجهة مدير المركز بالكامل.
          </Alert>

          <div className="mt-6">
            <Button variant="secondary" onClick={() => navigate("/manager")}>
              تجربة واجهة مدير المركز
            </Button>
          </div>
        </div>
      </Card>
    </PageContainer>
  );
}
