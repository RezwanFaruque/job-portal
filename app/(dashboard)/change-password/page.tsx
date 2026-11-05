import ChangePasswordComponent from "@/components/features/ChangePasswordComponent";
import LeftSideBar from "@/components/features/LeftSideBar";

export default function ChangePasswordPage() {
  return (
    <div className="layout-body">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <LeftSideBar activePath="/change-password" />
          </div>
          <div className="col-md-9">
            <ChangePasswordComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
