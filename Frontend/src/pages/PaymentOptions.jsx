import PropTypes from "prop-types";

function PaymentOptions({ selectedPayment, onPaymentChange }) {
  const paymentMethods = ["UPI", "COD"];

  return (
    <div className="w-full flex flex-col gap-4">
      <h3 className="text-2xl font-medium mb-2">Payment Options</h3>
      {paymentMethods.map((method) => (
        <label
          key={method}
          className={`flex items-center gap-2 border px-[13.5px] py-[11px] ${
            selectedPayment === method ? "bg-[#f6f6f6]" : "bg-white"
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value={method}
            checked={selectedPayment === method}
            onChange={() => onPaymentChange(method)} // Call the parent handler
            className="form-radio h-5 w-5 text-gray-600"
          />
          <span className="text-black">{method}</span>
        </label>
      ))}
    </div>
  );
}

PaymentOptions.propTypes = {
  selectedPayment: PropTypes.string,
  onPaymentChange: PropTypes.func,
};

export default PaymentOptions;
