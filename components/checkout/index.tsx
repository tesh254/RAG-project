import { Dialog, Transition } from "@headlessui/react";
import React, { Children, Fragment, ReactNode, useState } from "react";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Billing, PlansType } from "../../pages/billing";
import axios from "axios";
import { StripeCardElement, StripeCardNumberElement } from "@stripe/stripe-js";
import Button from "../button";

export default function Checkout({
  children,
  billing,
  plan,
}: {
  children: ReactNode;
  billing: Billing;
  plan: PlansType;
}) {
  let [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(undefined);
  const [disabled, setDisabled] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  function handleCardInputChange(event: any) {
    // Listen for changes in card input
    // and display errors, if any, to the user
    // Also control the disabled state of the submit button
    // if the input field is empty
    setDisabled(event?.empty);
    setError(event?.error?.message ?? "");
  }

  async function handleCheckoutFormSubmit(event: any) {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet.
      return;
    }

    // Call the subscribe endpoint and create a Stripe subscription
    // object. Returns the subscription ID and client secret
    const subscriptionResponse = await axios.post(
      "/api/billing/subscribe",
      {
        customerId: billing.billing_id,
        priceId: plan.id,
      },
      {
        withCredentials: true,
      }
    );
    const subscription = subscriptionResponse.data;
    const stripePayload = await stripe.confirmCardPayment(
      subscription.clientSecret, // returned by subscribe endpoint
      {
        payment_method: {
          card: elements.getElement(CardElement) as unknown as
            | StripeCardElement
            | StripeCardNumberElement
            | { token: string },
          billing_details: {
            name: event.target.name.value,
          },
        },
      }
    );

    if (stripePayload.error) {
      // @ts-ignore
      setError(stripePayload.error.message);
    }
  }

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <div className="">
        {React.Children.map(children, (child) => {
          if (
            React.isValidElement(child) &&
            child.props.type === "button" &&
            !child.props.disabled
          ) {
            return React.cloneElement(child, {
              // @ts-ignore
              onClick: () => {
                openModal();
              },
            });
          }

          return child;
        })}
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="mb-[16px]">
                    <Dialog.Title className="text-[18px]">
                      Upgrade to{" "}
                      <span className="text-suportal-purple">
                        {plan.product.name}
                      </span>
                    </Dialog.Title>
                    <Dialog.Description className="text-suportal-purple text-[22px]">
                      ${plan.amount / 100}/mo
                    </Dialog.Description>
                  </div>
                  <form onSubmit={handleCheckoutFormSubmit}>
                    <div
                      style={{
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                        borderRadius: "4px",
                        padding: "12px 8px",
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <CardElement
                        options={{
                          style: {
                            base: {
                              color: "#32325d",
                              fontFamily:
                                '"Helvetica Neue", Helvetica, sans-serif',
                              fontSmoothing: "antialiased",
                              fontSize: "16px",
                              "::placeholder": {
                                color: "#aab7c4",
                              },
                            },
                            invalid: {
                              color: "#fa755a",
                              iconColor: "#fa755a",
                            },
                          },
                        }}
                        onChange={handleCardInputChange}
                      />
                    </div>
                    <div className="mt-[16px]">
                      <Button
                        kind="third"
                        onClick={() => {}}
                        type="submit"
                        disabled={!stripe}
                        className="select-none w-full"
                      >
                        Pay
                      </Button>
                    </div>
                    <div className="w-full flex justify-center">
                      <p className="text-suportal-gray-light text-[12px] mt-[16px]">
                        Powered by Stripe
                      </p>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
