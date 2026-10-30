import LeftSideBar from "@/components/features/LeftSideBar";
import SuggestedJobsComponent from "@/components/features/SuggestedJobsComponent";

export default function SuggestedJobPage() {
  return (
    <div className="layout-body">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <LeftSideBar activePath="/suggested-job" />
          </div>
          <div className="col-md-9">
            <SuggestedJobsComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
