import {
  getAuthUserDetails,
  getFunnels,
  getNotificationAndUser,
  verifyAndAcceptInvitation,
} from "@/lib/queries";
import React from "react";
import FunnelsDataTable from "./data-table";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import FunnelForm from "@/components/forms/funnel-form";
import Sidebar from "@/components/sidebar";
import Infobar from "@/components/global/infobar";
import BlurPage from "@/components/global/blur-page";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import Unauthorized from "@/components/unauthorized";
import { Role } from "@prisma/client";

const Funnels = async ({ params }: { params: { subaccountId: string } }) => {
  const funnels = await getFunnels(params.subaccountId);

  const agencyId = await verifyAndAcceptInvitation();

  if (!agencyId) {
    return <Unauthorized />;
  }

  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  let notifications: any = [];

  if (!user.privateMetadata.role) {
    return <Unauthorized />;
  } else {
    const allPermissions = await getAuthUserDetails();
    const hasPermission = allPermissions?.Permissions.find(
      (permissions) =>
        permissions.access && permissions.subAccountId === params.subaccountId
    );
    if (!hasPermission) {
      return <Unauthorized />;
    }

    const allNotifications = await getNotificationAndUser(agencyId);

    if (
      user.privateMetadata.role === "AGENCY_ADMIN" ||
      user.privateMetadata.role === "AGENCY_OWNER"
    ) {
      notifications = allNotifications;
    } else {
      const filteredNoti = allNotifications?.filter(
        (item) => item.subAccountId === params.subaccountId
      );
      if (filteredNoti) notifications = filteredNoti;
    }
  }

  if (!funnels) return null;

  return (
    <BlurPage>
      <FunnelsDataTable
        actionButtonText={
          <>
            <Plus size={15} />
            Create Funnel
          </>
        }
        modalChildren={
          <FunnelForm subAccountId={params.subaccountId}></FunnelForm>
        }
        filterValue="name"
        columns={columns}
        data={funnels}
      />
    </BlurPage>
  );
};

export default Funnels;
