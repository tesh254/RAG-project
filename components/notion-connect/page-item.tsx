import * as React from "react";

type Select = {
  options: {
    color: string;
    id: string;
    name: string;
  }[];
  type: string;
};

const PageItem: React.FC<{
  pageItem: IPageProps;
}> = ({ pageItem }) => {
  return (
    <>
      {pageItem.properties.title && (
        <div className="w-full flex py-[8px] place-items-center justify-between">
          <div>
            <p className="font-medium text-[12px] text-suportal-gray-dark grow">
              {pageItem.properties.title.title[0].plain_text}
            </p>
          </div>
          <div className="flex place-items-center justify-center space-x-[6px] mr-[16px]">
            {pageItem.is_trained && (
              <div className="flex place-items-center space-x-[4px]">
                <div className="h-[8px] w-[8px] bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-400">trained</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export interface IPageProps {
  archived: false;
  cover: string | null;
  created_by: {
    id: string;
    object: "user";
  };
  created_time: string;
  description: string[];
  icon: string | null;
  id: string;
  is_inline: boolean;
  last_edited_by: {
    id: string;
    object: "user";
  };
  last_edited_time: string;
  object: "database" | "page";
  parent: {
    page_id?: string;
    type: string;
    block_id?: string;
  };
  public_url: string;
  properties: {
    title: {
      id: string;
      title: {
        type: string;
        href: string | null;
        plain_text: string;
        text: {
          content: string;
          link: string | null;
        };
      }[];
    };
    Assigned: {
      id: string;
      name: string;
      select: Select;
    };
    Description: {
      id: string;
      name: string;
      rich_text: any;
      type: string;
    };
    Name: {
      id: string;
      name: string;
      title: any;
      type: string;
    };
    Priority: {
      id: string;
      name: string;
      select: Select;
      type: string;
    };
    Progress?: {
      id: string;
      name: string;
      number: {
        format: string;
      };
      type: number;
    };
    Status?: {
      id: string;
      name: string;
      select: Select;
      type: string;
    };
    [key: string]: any;
  };
  is_trained: boolean;
}

export default PageItem;
