import React, { useEffect } from "react";
import { FormRow, FormRowSelect } from "../../components";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { handleChange, clearValues, createJob, editJob } from "../../features/job/jobSlice";
import { useNavigate } from "react-router-dom";

const AddJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    isLoading,
    position,
    company,
    jobLocation,
    jobTypeOptions,
    jobType,
    statusOptions,
    status,
    isEditing,
    editJobId,
  } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!position || !company || !jobLocation) {
      toast.error("please fill out all fields");
      return;
    }
    if (isEditing) {
      dispatch(editJob({jobId: editJobId, job: {
        position, company, jobLocation, status, jobType
      }}));
      setTimeout(() => {
        navigate("/all-jobs");
      }, 500);
      return;
    }
    dispatch(createJob({position, company, jobLocation, status, jobType}));
    setTimeout(() => {
      navigate("/all-jobs");
    }, 500);
    return;
  };

  const handleJobInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    dispatch(handleChange({name, value}));
  };

  useEffect(() => {
    if (!isEditing){
      dispatch(handleChange({
        name: "jobLocation",
        value: user.location
      }));
    }
  }, [dispatch, isEditing,user.location]);
  

  return (
    <Wrapper>
      <form className="form">
        <h3>{isEditing ? "edit job" : "add job"}</h3>
        <div className="form-center">
          {/* position */}
          <FormRow
            type="text"
            value={position}
            name="position"
            handleChange={handleJobInput}
          />
          {/* company */}
          <FormRow
            type="text"
            value={company}
            name="company"
            handleChange={handleJobInput}
          />
          {/* jobLocation */}
          <FormRow
            type="text"
            value={jobLocation}
            name="jobLocation"
            labelText="job location"
            handleChange={handleJobInput}
          />
          {/* status */}
          <FormRowSelect
          value={status}
          name="status"
          handleChange={handleJobInput}
          list={statusOptions}
          />
          {/* jobType */}
          <FormRowSelect
          value={jobType}
          labelText="job type"
          name="jobType"
          handleChange={handleJobInput}
          list={jobTypeOptions}
          />
          <div className="btn-container">
            <button type="button" className="btn btn-block clear-btn" onClick={() => dispatch(clearValues())}>clear</button>
            <button type="submit" className="btn btn-block submit-btn" onClick={handleSubmit}
            disabled={isLoading}>submit</button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};

export default AddJob;
