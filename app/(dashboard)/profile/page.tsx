import UserProfileDetails from "@/components/features/UserProfileDetails";
import LeftSideBar from "@/components/features/LeftSideBar";

export default function ProfilePage() {
  return (
    <div className="layout-body">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <LeftSideBar activePath="/profile" />
          </div>
          <div className="col-md-9">
            <UserProfileDetails />
          </div>
        </div>
      </div>
    </div>
  );
}
