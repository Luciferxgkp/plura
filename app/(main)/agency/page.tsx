import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAuthUserDetails, verifyAndAcceptInvitation } from "@/lib/queries";
import AgencyDetails from "@/components/forms/agency-details";

const Index = async ({
  searchParams,
}: {
  searchParams: {
    plan: string;
    state: string;
    code: string;
  };
}) => {
  const agencyId = await verifyAndAcceptInvitation();

  const user = await getAuthUserDetails();

  if (agencyId) {
    if (user?.role === "SUBACCOUNT_GUEST" || user?.role === "SUBACCOUNT_USER") {
      redirect(`/subaccount`);
    }
    if (user?.role === "AGENCY_OWNER" || user?.role === "AGENCY_ADMIN") {
      if (searchParams?.plan) {
        return redirect(
          `/agency/${agencyId}/billing?plan=${searchParams.plan}`
        );
      }
      if (searchParams?.state && searchParams?.code) {
        const statePath = searchParams.state.split("__")[0];
        const stateAgencyId = searchParams.state.split("__")[1];

        if (!stateAgencyId) {
          return <div>Not Authorized</div>;
        }
        return redirect(
          `/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`
        );
      }
      return redirect(`/agency/${agencyId}`);
    } else {
      return <div>Not Authorized</div>;
    }
  }

  const authUser = await currentUser();

  return (
    <div className="flex justify-center items-center mt-4">
      <div className="max-w-[850px] border-[1px] p-4 rounded-xl">
        <h1 className="text-4xl text-center">Create an Agency</h1>
        <AgencyDetails
          data={{
            companyEmail: authUser?.emailAddresses[0].emailAddress,
          }}
        />
      </div>
    </div>
  );
};

export default Index;
