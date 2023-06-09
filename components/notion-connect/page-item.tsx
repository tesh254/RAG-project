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
        <div className="w-full flex py-[8px] place-items-center">
          <div>
            <p className="font-medium text-[12px] text-suportal-gray-dark grow">
              {pageItem.properties.title.title[0].plain_text}
            </p>
          </div>
          <div className="flex">
            
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
}

export default PageItem;
