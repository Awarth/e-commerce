import PropTypes from "prop-types";
import { useState } from "react";
import { indianStates } from "../utility/IndiaStates";

function Address({ addressDetail, setAddressDetail, handleInputChange }) {
  const [isEditable, setIsEditable] = useState(true);

  const toggleEdit = () => setIsEditable((prev) => !prev);

  return (
    <form className="flex flex-col gap-4 w-full">
      <h3 className="text-2xl font-medium flex justify-between">
        Delivery
        <button
          type="button"
          onClick={toggleEdit}
          className="text-sm border rounded px-3 py-1"
        >
          {isEditable ? "Save" : "Edit"}
        </button>
      </h3>
      <div className="flex flex-col gap-4 w-full bg-[#0000000B] p-2 rounded border ">
        <input
          value={addressDetail.name}
          onChange={handleInputChange}
          required
          type="text"
          name="name"
          className="border rounded py-[11px] px-[13.5px] placeholder:font-light"
          disabled={!isEditable}
          placeholder="Full Name *"
        />

        <input
          value={addressDetail.phoneNo}
          onChange={handleInputChange}
          required
          minLength={10}
          type="text"
          name="phoneNo"
          className="border rounded py-[11px] px-[13.5px] placeholder:font-light"
          disabled={!isEditable}
          placeholder="Phone number *"
        />

        <input
          value={addressDetail.alternatePhone}
          onChange={handleInputChange}
          type="text"
          minLength={10}
          name="alternatePhone"
          className="border rounded py-[11px] px-[13.5px] placeholder:font-light"
          disabled={!isEditable}
          placeholder="Alternate Number"
        />

        <input
          value={addressDetail.address}
          onChange={handleInputChange}
          required
          type="text"
          name="address"
          className="border rounded py-[11px] px-[13.5px] placeholder:font-light"
          disabled={!isEditable}
          placeholder="Address *"
        />

        <div className="flex flex-col min-[400px]:flex-row gap-4 min-[400px]:gap-2 w-full">
          <input
            value={addressDetail.cityTownVillage}
            onChange={handleInputChange}
            required
            type="text"
            name="cityTownVillage"
            className="border w-full rounded py-[11px] px-[13.5px] placeholder:font-light"
            disabled={!isEditable}
            placeholder="City/Town/Village *"
          />

          <input
            value={addressDetail.district}
            onChange={handleInputChange}
            required
            type="text"
            name="district"
            className="border w-full rounded py-[11px] px-[13.5px] placeholder:font-light"
            disabled={!isEditable}
            placeholder="District *"
          />
        </div>

        <div className="flex flex-col min-[400px]:flex-row gap-4 min-[400px]:gap-2 w-full">
          <select
            value={addressDetail.state}
            onChange={handleInputChange}
            name="state"
            className="border w-full rounded py-[11px] px-[13.5px] bg-white placeholder:font-light"
            disabled={!isEditable}
            required
          >
            <option value="" disabled>
              Select State *
            </option>
            {indianStates.map((state, index) => (
              <option value={state} key={index}>
                {state}
              </option>
            ))}
          </select>

          <input
            value={addressDetail.pinCode}
            onChange={handleInputChange}
            required
            type="text"
            name="pinCode"
            className="border w-full rounded py-[11px] px-[13.5px] placeholder:font-light"
            disabled={!isEditable}
            placeholder="Pincode *"
          />
        </div>
      </div>
    </form>
  );
}

Address.propTypes = {
  addressDetail: PropTypes.object.isRequired,
  setAddressDetail: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

export default Address;
