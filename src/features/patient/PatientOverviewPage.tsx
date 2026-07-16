import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useDemoData } from "@/context/DemoDataContext";
import { useSession } from "@/context/SessionContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useFocusOnMount } from "@/hooks/useFocusOnMount";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DemoDataBadge } from "@/components/manager/DemoDataBadge";
import { PatientProgressIndicator } from "@/components/manager/PatientProgressIndicator";
import { EmptyState } from "@/components/feedback/EmptyState";
import { formatDate } from "@/lib/format";
import {
  CalendarDays,
  Activity,
  Dumbbell,
  CalendarClock,
  Bell,
  Heart,
  Stethoscope,
  Sparkles,
  Video,
  User,
} from "lucide-react";

export function PatientOverviewPage() {
  useDocumentTitle("صفحتي");
  const headingRef = useFocusOnMount<HTMLHeadingElement>();
  const { data } = useDemoData();
  const { session } = useSession();

  // Identify the current patient. Fallback to first active patient (p1, محمد العتيبي).
  const patient = useMemo(() => {
    if (session?.username) {
      const match = data.patients.find(
        (p) => p.username === session.username && p.status === "active",
      );
      if (match) return match;
    }
    return data.patients.find((p) => p.status === "active") ?? data.patients[0];
  }, [data.patients, session]);

  const today = new Date().toISOString().split("T")[0];

  // Next upcoming appointment for this patient
  const nextAppointment = useMemo(() => {
    return data.appointments
      .filter((a) => a.patientId === patient.id && a.status === "scheduled" && a.date >= today)
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0];
  }, [data.appointments, patient.id, today]);

  // Assigned exercises
  const myExercises = useMemo(
    () => data.exercises.filter((ex) => ex.patientId === patient.id),
    [data.exercises, patient.id],
  );

  // Active treatment plan
  const activePlan = useMemo(
    () => data.treatmentPlans.find((tp) => tp.patientId === patient.id && tp.status === "active"),
    [data.treatmentPlans, patient.id],
  );

  // Assigned therapist
  const therapist = useMemo(
    () => data.employees.find((e) => e.id === patient.assignedTherapistId),
    [data.employees, patient.assignedTherapistId],
  );

  const nextActivityLabel = useMemo(() => {
    if (nextAppointment) {
      return `موعدك القادم يوم ${formatDate(nextAppointment.date)} الساعة ${nextAppointment.time}`;
    }
    if (myExercises.length > 0) {
      return "لديك تمارين يمكن أداؤها اليوم — اضغط على تماريني للبدء";
    }
    return "لا توجد أنشطة مجدولة حالياً";
  }, [nextAppointment, myExercises]);

  return (
    <PageContainer maxWidth="max-w-4xl" className="py-8">
      <PageHeader
        title={`أهلاً ${patient.fullName.split(" ")[0]}`}
        subtitle="هذه صفحتك الخاصة لمتابعة رحلة التأهيل"
        actions={<DemoDataBadge />}
      />
      <h2 ref={headingRef} className="sr-only">لوحة المتابعة</h2>

      {/* Today's next activity */}
      <Card className="mb-6 bg-primary-50 border-primary-200">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary-100 p-3 shrink-0">
            <CalendarClock className="h-8 w-8 text-primary-700" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-ink mb-1">نشاطك القادم</p>
            <p className="text-base text-neutral-700 leading-relaxed">{nextActivityLabel}</p>
          </div>
        </div>
      </Card>

      {/* Next appointment card */}
      {nextAppointment ? (
        <Card className="mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-6 w-6 text-primary-600" aria-hidden="true" />
              <h3 className="text-xl font-bold text-ink">موعدك القادم</h3>
            </div>
            <Badge tone={nextAppointment.channel === "video" ? "accent" : "primary"}>
              {nextAppointment.channel === "video" ? "عن بُعد (فيديو)" : "حضوري"}
            </Badge>
          </div>
          <div className="space-y-3 text-base text-neutral-700">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-neutral-400" aria-hidden="true" />
              <span>{formatDate(nextAppointment.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-neutral-400" aria-hidden="true" />
              <span>الساعة {nextAppointment.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-neutral-400" aria-hidden="true" />
              <span>النوع: {nextAppointment.type}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-neutral-400" aria-hidden="true" />
              <span>المعالج: {therapist?.fullName ?? "غير محدد"}</span>
            </div>
          </div>
          <div className="mt-5">
            <Link to="/patient/appointments">
              <Button variant="secondary" fullWidth leftIcon={<CalendarDays className="h-5 w-5" aria-hidden="true" />}>
                الذهاب إلى مواعيدي
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <Card className="mb-6">
          <EmptyState
            icon={<CalendarDays className="h-12 w-12" aria-hidden="true" />}
            title="لا يوجد موعد قادم"
            description="عندما يتم جدولة موعد لك سيظهر هنا. يمكنك طلب موعد تجريبي من صفحة المواعيد."
            action={
              <Link to="/patient/appointments">
                <Button variant="primary">الذهاب إلى المواعيد</Button>
              </Link>
            }
          />
        </Card>
      )}

      {/* Treatment plan summary */}
      {activePlan ? (
        <Card className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="h-6 w-6 text-primary-600" aria-hidden="true" />
            <h3 className="text-xl font-bold text-ink">خطتك العلاجية</h3>
          </div>
          <p className="text-lg font-semibold text-ink mb-2">{activePlan.title}</p>
          <p className="text-base text-neutral-600 mb-3">
            تكرار الجلسات: {activePlan.sessionFrequency}
          </p>
          <div className="mb-4">
            <p className="text-sm font-semibold text-neutral-600 mb-2">أهدافك:</p>
            <ul className="space-y-2">
              {activePlan.goals.map((goal) => (
                <li key={goal.id} className="flex items-start gap-2 text-base text-neutral-700">
                  <Heart className="h-5 w-5 text-primary-500 shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{goal.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <PatientProgressIndicator value={activePlan.progress} />
          </div>
        </Card>
      ) : (
        <Card className="mb-6">
          <EmptyState
            icon={<Activity className="h-12 w-12" aria-hidden="true" />}
            title="لا توجد خطة علاجية نشطة"
            description="عندما يع assigned لك المعالج خطة علاجية ستظهر هنا."
          />
        </Card>
      )}

      {/* Weekly progress */}
      <Card className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="h-6 w-6 text-primary-600" aria-hidden="true" />
          <h3 className="text-xl font-bold text-ink">تقدمك الأسبوعي</h3>
        </div>
        <PatientProgressIndicator value={patient.progress} />
        <p className="text-base text-neutral-600 mt-3 leading-relaxed">
          أحسنت! استمر في أداء تمارينك وحضور مواعيدك. كل خطوة تقربك من هدفك.
        </p>
      </Card>

      {/* Reminder cards (fictional UI) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Card>
          <div className="flex items-start gap-3 mb-3">
            <div className="rounded-full bg-warning-100 p-2 shrink-0">
              <Bell className="h-6 w-6 text-warning-600" aria-hidden="true" />
            </div>
            <div>
              <p className="text-lg font-bold text-ink">تذكير تجريبي</p>
              <p className="text-sm text-neutral-500">هذا تذكير وهمي للعرض فقط</p>
            </div>
          </div>
          <p className="text-base text-neutral-700 leading-relaxed">
            موعدك القادم يوم {nextAppointment ? formatDate(nextAppointment.date) : "غير محدد"}
          </p>
        </Card>

        <Card>
          <div className="flex items-start gap-3 mb-3">
            <div className="rounded-full bg-success-100 p-2 shrink-0">
              <Dumbbell className="h-6 w-6 text-success-600" aria-hidden="true" />
            </div>
            <div>
              <p className="text-lg font-bold text-ink">تذكير تجريبي</p>
              <p className="text-sm text-neutral-500">هذا تذكير وهمي للعرض فقط</p>
            </div>
          </div>
          <p className="text-base text-neutral-700 leading-relaxed">
            لديك {myExercises.filter((ex) => ex.status === "active").length} تمارين نشطة لأدائها
          </p>
        </Card>
      </div>

      {/* Large primary actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/patient/exercises">
          <Button variant="primary" size="lg" fullWidth leftIcon={<Dumbbell className="h-6 w-6" aria-hidden="true" />}>
            عرض تماريني
          </Button>
        </Link>
        <Link to="/patient/appointments">
          <Button variant="primary" size="lg" fullWidth leftIcon={<CalendarDays className="h-6 w-6" aria-hidden="true" />}>
            مواعيدي
          </Button>
        </Link>
        <Link to="/patient/companion">
          <Button variant="primary" size="lg" fullWidth leftIcon={<Sparkles className="h-6 w-6" aria-hidden="true" />}>
            المرافق الذكي
          </Button>
        </Link>
      </div>

      {/* Video hint */}
      {nextAppointment?.channel === "video" && (
        <Card className="mt-6 bg-accent-50 border-accent-200">
          <div className="flex items-start gap-3">
            <Video className="h-6 w-6 text-accent-600 shrink-0" aria-hidden="true" />
            <p className="text-base text-neutral-700 leading-relaxed">
              موعدك القادم عن بُعد. يمكنك الدخول إلى صفحة المواعيد والضغط على زر الانضمام عند وقت الموعد.
            </p>
          </div>
        </Card>
      )}
    </PageContainer>
  );
}
