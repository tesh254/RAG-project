import { useState, FC, ReactNode } from "react";
import { Tab } from "@headlessui/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  tabs: {
    [key: string]: {
      id: number;
      content: ReactNode;
    };
  };
};

const Tabs: FC<Props> = ({ tabs }) => {
  return (
    <div className="w-full max-w-md px-12 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-suportal-purple p-1">
          {Object.keys(tabs).map((tab: string) => {
            return (
              <Tab
                key={tab}
                className={({ selected }) =>
                  classNames(
                    "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-suportal-purple",
                    "ring-white ring-opacity-60 ring-offset-2 ring-offset-suportal-purple focus:outline-none focus:ring-2",
                    selected
                      ? "bg-white shadow"
                      : "text-white hover:bg-white/[0.12] hover:text-white"
                  )
                }
              >
                {tab}
              </Tab>
            );
          })}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {Object.values(tabs).map((tab, idx: number) => {
            return (
              <Tab.Panel
                key={idx}
                className={classNames(
                  "rounded-xl bg-white p-3",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2"
                )}
              >
                <div>{tab.content}</div>
              </Tab.Panel>
            );
          })}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Tabs;
