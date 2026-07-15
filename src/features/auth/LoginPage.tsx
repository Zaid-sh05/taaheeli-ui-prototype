import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useSession, ROLE_HOME } from "@/context/SessionContext";
import { ROLES } from "@/config/roles";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useFocusOnMount } from "@/hooks/useFocusOnMount";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Field } from "@/components/ui/Field";
import { FormErrorSummary } from "@/components/feedback/FormErrorSummary";

export function LoginPage() {
  useDocumentTitle("تسجيل الدخول");
  const navigate = useNavigate();
  const { selectedRole, login } = useSession();
  const headingRef = useFocusOnMount<HTMLHeadingElement>();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const roleMeta = selectedRole ? ROLES[selectedRole] : null;
  const showRegisterLink = selectedRole === "patient" || !selectedRole;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs: string[] = [];
    if (!username.trim()) errs.push("اسم المستخدم مطلوب");
    if (!password) errs.push("كلمة المرور مطلوبة");
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }

    const role = selectedRole ?? "patient";
    login(role, username.trim());
    navigate(ROLE_HOME[role]);
  }

  return (
    <PageContainer className="py-10">
      <PageHeader
        title="تسجيل الدخول"
        subtitle={roleMeta ? `دخول بدور: ${roleMeta.label}` : "أدخل بياناتك للمتابعة"}
      />
      <h2 ref={headingRef} className="sr-only">
        نموذج تسجيل الدخول
      </h2>

      <Card>
        {errors.length > 0 && <FormErrorSummary errors={errors} className="mb-4" />}

        <form onSubmit={handleSubmit} noValidate>
          <Field label="اسم المستخدم" htmlFor="username" required>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              hasError={errors.some((x) => x.includes("اسم المستخدم"))}
              aria-required
            />
          </Field>

          <div className="mb-4">
            <Label htmlFor="password" required>
              كلمة المرور
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                hasError={errors.some((x) => x.includes("كلمة المرور"))}
                className="ps-3 pe-12"
                aria-required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 end-0 inline-flex items-center justify-center px-3 text-neutral-600 hover:text-primary-700 min-h-[48px]"
                aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Button type="submit" fullWidth leftIcon={<LogIn className="h-5 w-5" aria-hidden="true" />}>
              دخول
            </Button>
            <div className="flex items-center justify-between text-base">
              <Link to="/" className="text-primary-700 font-semibold hover:underline">
                تغيير الدور
              </Link>
              {showRegisterLink && (
                <Link to="/register/patient" className="text-primary-700 font-semibold hover:underline">
                  تسجيل مريض جديد
                </Link>
              )}
            </div>
          </div>
        </form>
      </Card>

      <p className="mt-4 text-sm text-neutral-500 text-center">
        أدخل أي اسم مستخدم وكلمة مرور لتجربة الواجهة المختارة.
      </p>
    </PageContainer>
  );
}
