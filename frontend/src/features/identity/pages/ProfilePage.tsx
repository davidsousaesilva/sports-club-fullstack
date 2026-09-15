import { useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BarChart3, Loader2, User } from "lucide-react";

import { Card, CardContent } from "../../../shared/components/ui/card/Card";
import { appPaths } from "../../../app/router/paths";

import { useCurrentUser } from "../../auth/hooks/use-current-user";
import { usePermissions } from "../../auth";
import { ProfileDetailsForm } from "../components/profile/ProfileDetailsForm";
import { ProfileSecurityCard } from "../components/profile/ProfileSecurityCard";
import { ProfileRolesCard } from "../components/profile/ProfileRolesCard";
import { AssignRoleDialog } from "../components/profile/AssignRoleDialog";
import { TerminateRoleDialog } from "../components/profile/TerminateRoleDialog";
import { ProfileStatisticsTab } from "../components/profile/ProfileStatisticsTab";
import { useProfile } from "../hooks/use-profile";
import type {
  AssignRoleFormValues,
  ChangeOwnPasswordFormValues,
  PersonRoleItem,
  ResetPasswordFormValues,
  UpdatePersonFormValues,
} from "../model/person.types";

type ProfileTab = "personal" | "statistics";

function ProfilePage() {
  const navigate = useNavigate();
  const params = useParams<{ personId?: string }>();
  const { user: currentUser } = useCurrentUser();
  const { activeRole } = usePermissions();

  const [activeTab, setActiveTab] = useState<ProfileTab>("personal");
  const [assignRoleDialogOpen, setAssignRoleDialogOpen] = useState(false);
  const [terminateRoleDialogOpen, setTerminateRoleDialogOpen] = useState(false);
  const [selectedRoleToTerminate, setSelectedRoleToTerminate] =
    useState<PersonRoleItem | null>(null);
  const [detailsEditorOpen, setDetailsEditorOpen] = useState(false);
  const [securityEditorOpen, setSecurityEditorOpen] = useState(false);

  const authenticatedPersonId = currentUser?.id ?? null;

  const routePersonId = useMemo(() => {
    if (!params.personId) {
      return null;
    }

    const parsedValue = Number(params.personId);
    return Number.isFinite(parsedValue) ? parsedValue : null;
  }, [params.personId]);

  const isOwnProfileRoute = !params.personId;
  const personId = isOwnProfileRoute ? authenticatedPersonId : routePersonId;

  const isManager = activeRole === "MANAGER";
  const isEmployee = activeRole === "EMPLOYEE";
  const isCoach = activeRole === "COACH";
  const isAthlete = activeRole === "ATHLETE";
  const canManageOtherProfiles = isManager || isEmployee;

  const isOwnProfile =
    authenticatedPersonId !== null &&
    personId !== null &&
    authenticatedPersonId === personId;

  const canEditProfile = isOwnProfile || canManageOtherProfiles;
  const canManageRoles = isManager || isEmployee;

  const canChangeOwnPassword = isOwnProfileRoute && isOwnProfile;
  const canManagePasswordReset =
    !isOwnProfileRoute && (isManager || isEmployee) && !isOwnProfile;

  const canViewStatistics =
    isManager || (isOwnProfile && isAthlete);

  const shouldRedirectUnauthorizedExternalProfile =
    !isOwnProfileRoute && !canManageOtherProfiles;

  const isInvalidOwnProfile =
    isOwnProfileRoute && authenticatedPersonId === null;
  const isInvalidExternalProfile = !isOwnProfileRoute && routePersonId === null;
  const isInvalidPersonId =
    personId === null || isInvalidOwnProfile || isInvalidExternalProfile;

  const {
    profile,
    statistics,
    isLoading,
    isFetching,
    updatePerson,
    isUpdatingPerson,
    alterOwnPassword,
    isAlteringOwnPassword,
    setPasswordByStaff,
    isSettingPasswordByStaff,
    assignRole,
    isAssigningRole,
    terminateRole,
    isTerminatingRole,
    makePrimaryRole,
    isMakingPrimaryRole,
    isLoadingStatistics,
  } = useProfile(personId ?? 0);

  const handleChangeOwnPassword = async (
    values: ChangeOwnPasswordFormValues,
  ) => {
    await alterOwnPassword(values);
    setSecurityEditorOpen(false);
  };

  const handleSetPasswordByStaff = async (values: ResetPasswordFormValues) => {
    await setPasswordByStaff(values);
    setSecurityEditorOpen(false);
  };

  const handleAssignRole = async (values: AssignRoleFormValues) => {
    await assignRole(values);
    setAssignRoleDialogOpen(false);
  };

  const handleUpdatePerson = async (values: UpdatePersonFormValues) => {
    await updatePerson({
      person: profile.person,
      values,
    });
    setDetailsEditorOpen(false);
  };

  if (shouldRedirectUnauthorizedExternalProfile) {
    return <Navigate to={appPaths.unauthorized} replace />;
  }

  if (isInvalidPersonId) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold text-slate-950">Perfil</h1>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <p className="text-sm text-slate-600">
              Indentificador de perfil inválido.
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (isLoading || !profile) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold text-slate-950">Profile</h1>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="flex min-h-[220px] items-center justify-center gap-3 pt-6 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm">A carregar perfil...</span>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (!canViewStatistics && activeTab === "statistics") {
    setActiveTab("personal");
  }

  return (
    <>
      <section className="space-y-6">
        <header className="space-y-5">
          {!isOwnProfileRoute && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
          )}

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-slate-950">
                {isOwnProfileRoute
                  ? "O meu perfil"
                  : `Perfil de ${profile.person.name}`}
              </h1>
              <p className="text-sm text-slate-600">
                Visualizar e editar informações pessoais
              </p>
            </div>
          </div>

          <nav className="border-b border-slate-200">
            <div className="-mb-px flex items-center gap-8">
              <button
                type="button"
                onClick={() => setActiveTab("personal")}
                className={`inline-flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition ${
                  activeTab === "personal"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                }`}
              >
                <User className="h-4 w-4" />
                Dados Pessoais
              </button>

              {canViewStatistics && (
                <button
                  type="button"
                  onClick={() => setActiveTab("statistics")}
                  className={`inline-flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition ${
                    activeTab === "statistics"
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                  Estatísticas
                </button>
              )}
            </div>
          </nav>
        </header>

        {isFetching && (
          <p className="text-sm text-slate-500">
            A atualizar dados do perfil...
          </p>
        )}

        {activeTab === "personal" ? (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_420px]">
            <div className="space-y-6">
              <ProfileDetailsForm
                person={profile.person}
                disabled={!canEditProfile}
                isOpen={detailsEditorOpen}
                isSubmitting={isUpdatingPerson}
                onOpenChange={setDetailsEditorOpen}
                onSubmit={handleUpdatePerson}
              />

              {(canChangeOwnPassword || canManagePasswordReset) && (
                <ProfileSecurityCard
                  canChangeOwnPassword={canChangeOwnPassword}
                  canManagePasswordReset={canManagePasswordReset}
                  isOpen={securityEditorOpen}
                  onOpenChange={setSecurityEditorOpen}
                  isChangingOwnPassword={isAlteringOwnPassword}
                  isResettingPassword={isSettingPasswordByStaff}
                  onChangeOwnPassword={handleChangeOwnPassword}
                  onResetPassword={handleSetPasswordByStaff}
                />
              )}
            </div>

            <div className="space-y-6">
              <ProfileRolesCard
                activeRoles={profile.person.activeRoles}
                temporalHistory={profile.temporalHistory}
                canManageRoles={canManageRoles}
                isMakingPrimaryRole={isMakingPrimaryRole}
                onAddRole={() => setAssignRoleDialogOpen(true)}
                onMakePrimaryRole={makePrimaryRole}
                onTerminateRole={(role) => {
                  setSelectedRoleToTerminate(role);
                  setTerminateRoleDialogOpen(true);
                }}
              />
            </div>
          </div>
        ) : (
          <ProfileStatisticsTab
            statistics={statistics}
            isLoading={isLoadingStatistics}
          />
        )}
      </section>

      <AssignRoleDialog
        open={assignRoleDialogOpen}
        hasExistingRoles={profile.person.activeRoles.length > 0}
        isSubmitting={isAssigningRole}
        onOpenChange={setAssignRoleDialogOpen}
        onSubmit={handleAssignRole}
      />

      <TerminateRoleDialog
        open={terminateRoleDialogOpen}
        role={selectedRoleToTerminate}
        isSubmitting={isTerminatingRole}
        onOpenChange={(open) => {
          setTerminateRoleDialogOpen(open);

          if (!open) {
            setSelectedRoleToTerminate(null);
          }
        }}
        onSubmit={async (values) => {
          if (!selectedRoleToTerminate) {
            return;
          }

          await terminateRole({
            personRoleId: selectedRoleToTerminate.id,
            version: selectedRoleToTerminate.version,
            values,
          });
        }}
      />
    </>
  );
}

export { ProfilePage };