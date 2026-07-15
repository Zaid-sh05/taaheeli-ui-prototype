import { useNavigate } from "react-router-dom";
import { useRole } from "@/context/RoleContext";
import { ROLES } from "@/config/roles";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useFocusOnMount } from "@/hooks/useFocusOnMount";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";

export function PlaceholderDashboard() {
  useDocumentTitle("لوحة التحكم");
  const navigate = useNavigate();
  const { role } = useRole();
  const headingRef = useFocusOnMount<HTMLHeadingElement>();
  const roleMeta = role ? ROLES[role] : null;

  return (
    <PageContainer className="py-10">
      <PageHeader title={roleMeta ? `لوحة ${roleMeta.label}` : "لوحة التحكم"} />
      <h2 ref={headingRef} className="sr-only">
        لوحة التحكم
      </h2>

      <Card>
        <Alert tone="info" title="هذه شاشة تجريبية">
          ستظهر هنا لوحة التحكم الخاصة بدور <strong>{roleMeta?.label ?? "المستخدم"}</strong> في المرحلة
          القادمة. في هذا النموذج التجريبي يمكنك تجربة التنقل بين الأدوار وشاشات تسجيل الدخول والتسجيل.
        </Alert>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => navigate("/")}>
            تغيير الدور
          </Button>
          <Button variant="ghost" onClick={() => navigate("/login")}>
            العودة لتسجيل الدخول
          </Button>
        </div>
      </Card>
    </PageContainer>
  );
}
