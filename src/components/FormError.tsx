import { FC } from "react";

interface ErrorProps {
  errors: Record<string, string>;
}

const FormError: FC<ErrorProps> = ({ errors }) => {
  return (
    <div className="form-errors">
      {Object.keys(errors).map((field) => (
        <p key={field} className="text-red-600">
          {errors[field]}
        </p>
      ))}
    </div>
  );
};

export default FormError;
