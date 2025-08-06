// components/FeedbackModal.tsx
import { Fragment } from "react";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: "error" | "success" | "info";
}

export default function FeedbackModal({
  isOpen,
  onClose,
  title = "Aviso",
  message,
  type = "info",
}: FeedbackModalProps) {
  const icons = {
    error: <ExclamationTriangleIcon className="h-6 w-6 text-danger" />,
    success: <CheckCircleIcon className="h-6 w-6 text-success" />,
    info: <InformationCircleIcon className="h-6 w-6 text-info" />,
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog
        onClose={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <Transition
          show={isOpen}
          as={Fragment}
          enter="transition-opacity ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition>

        <Transition
          show={isOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <DialogPanel className="mx-4 max-w-md w-full z-10 bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-start space-x-3">
              <div>{icons[type]}</div>
              <div>
                <DialogTitle className="text-lg font-semibold text-foreground">
                  {title}
                </DialogTitle>
                <Description className="text-sm text-gray-700 mt-1">
                  {message}
                </Description>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={onClose}
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
              >
                OK
              </button>
            </div>
          </DialogPanel>
        </Transition>
      </Dialog>
    </Transition>
  );
}
