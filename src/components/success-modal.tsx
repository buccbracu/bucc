import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function SuccessModal({
  isOpen,
  messageTitle,
  messageBody,
}: {
  isOpen: boolean;
  messageTitle: string;
  messageBody: string;
}) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex justify-center items-center">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 130.2 130.2"
              className="mx-auto mb-4 w-32"
            >
              <circle
                className="path circle"
                fill="none"
                stroke="#198754"
                strokeWidth="6"
                strokeMiterlimit="10"
                cx="65.1"
                cy="65.1"
                r="62.1"
              />
              <polyline
                className="path check"
                fill="none"
                stroke="#198754"
                strokeWidth="6"
                strokeLinecap="round"
                strokeMiterlimit="10"
                points="100.2,40.2 51.5,88.8 29.8,67.5"
              />
            </svg>
          </div>
          <DialogTitle>
            <h4 className="text-[#198754] text-xl font-semibold mt-3">
              {messageTitle}
            </h4>
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-3">
            {messageBody}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
