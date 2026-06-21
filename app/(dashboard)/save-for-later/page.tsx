import SavedForLaterComponent from "@/components/features/SavedForLaterComponent";
import LeftSideBar from "@/components/features/LeftSideBar";

export default function SaveForLaterPage() {
  return (
    <div className="layout-body">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <LeftSideBar activePath="/save-for-later" />
          </div>
          <div className="col-md-9">
            <SavedForLaterComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
