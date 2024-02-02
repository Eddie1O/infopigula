import { json, type HeadersFunction, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { IoMdHeartEmpty } from "react-icons/io";
import {
  IoChatboxOutline,
  IoShareSocialOutline,
  IoStarOutline,
} from "react-icons/io5";
import { LoaderFunctionArgs } from "react-router";

export const headers: HeadersFunction = () => ({
  "Cache-Control": "public, max-age=3600, s-maxage=7200",
});

import logo from "~/assets/logo.svg";
import { FetchResult } from "~/utils/types";

export const meta: MetaFunction = () => {
  return [{ title: "Infopiguła" }, { name: "description", content: "" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const target = url.searchParams.get("targetId");
  const data = await fetch(
    `https://api.infopigula.pl/api/v1/news-app?_format=json&group_target_id=${
      target === "3" ? 3 : 2
    }&page=0&keys=&show_last_release=1`
  );
  const result: FetchResult = await data.json();
  result.rows.forEach((row) => {
    row.field_news_content = row.field_news_content.replace(/<img[^>]*>/g, "");
  });

  return json(
    { ...result },
    { headers: { "Cache-Control": "public, max-age=3600" } }
  );
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <img
        className="w-fit mx-auto h-16 py-4 dark:invert"
        src={logo}
        alt="logo"
      />
      <p className=" p-3 rounded text-center ring-1 dark:bg-yellow-400 ring-yellow-500 bg-yellow-200 text-black">
        To tylko strona testowa, prawdziwą Infopigułę znajdziesz{" "}
        <a className="dark:text-sky-800" href="https://infopigula.pl">
          tutaj
        </a>
      </p>
      <ul id="nav" className="flex pt-8 flex-wrap gap-4">
        {data.form_options.groups.map((group) => (
          <li key={group.target_id}>
            <a
              href={
                group.target_id == "2" ? "/" : `?targetId=${group.target_id}`
              }
              className="whitespace-nowrap"
            >
              {group.value}
            </a>
          </li>
        ))}
      </ul>
      <div className="bg-neutral-100 dark:bg-neutral-500 my-2 rounded-lg border border-neutral-400 p-4">
        Wydanie: {data.form_options.last_releases[0].value}
      </div>
      <div className="max-w-2xl mx-auto">
        {data.rows.map((row) => (
          <div
            className="py-4  first:border-t-transparent border-t"
            key={row.nid}
          >
            <div
              dangerouslySetInnerHTML={{ __html: row.field_news_content }}
            ></div>
            <ul className="flex place-content-between place-items-center">
              <li>
                <IoMdHeartEmpty className="size-6" />
              </li>
              <li>
                <IoShareSocialOutline className="size-6" />
              </li>
              <li>
                <div className="bg-neutral-900 px-4 rounded-full py-1 text-white dark:bg-neutral-200 dark:text-black">
                  logo
                </div>
              </li>
              <li>
                <IoChatboxOutline className="size-6" />
              </li>
              <li className="flex gap-1 place-items-center">
                <IoStarOutline className="size-6" />
                {row.vote.vote_average}
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
