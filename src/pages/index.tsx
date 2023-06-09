/* eslint-disable @next/next/no-img-element */
import { type NextPage } from "next";
import Head from "next/head";
import { SignInButton, useUser } from "@clerk/nextjs";
import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";
import Image from "next/image";
import { LoadingEmoji } from "~/components/Loading";
import { useState } from "react";

dayjs.locale("pt-br");
dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const ctx = api.useContext();
  const { user } = useUser();
  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setContent("");
      void ctx.posts.getAll.invalidate();
    },
  });
  const [content, setContent] = useState("");

  if (!user) {
    return <div>Faça Login para Emotar</div>;
  }

  return (
    <div className="flex w-full gap-3">
      <Image
        src={user?.profileImageUrl}
        className="rounded-full"
        alt=""
        width={50}
        height={50}
        placeholder="empty"
      />
      <input
        placeholder="Emote o que você está pensando"
        className="grow bg-transparent outline-none"
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isPosting}
      />
      <button onClick={() => mutate({ content })}>Emotar</button>
    </div>
  );
};

type PostnUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostnUser) => {
  const { post, author } = props;
  return (
    <div className="flex items-center gap-3 border-b border-[#2f3336] p-4">
      {" "}
      <Image
        src={author.profilePicture}
        className="rounded-full"
        alt=""
        width={50}
        height={50}
        placeholder="empty"
      />
      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          <span className="font-semibold">
            {author.firstName} {author.lastName}
          </span>
          <span className="font-regular text-[#6e7378]">
            @{author.username}
          </span>{" "}
          <span className="text-[#6e7378]">·</span>{" "}
          <span className="font-regular text-[#6e7378]">
            {dayjs(post.createdAt).fromNow().toString()}
          </span>
        </div>
        <span className="text-xl">{post.content}</span>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading } = api.posts.getAll.useQuery();
  if (isLoading) {
    return <LoadingEmoji />;
  }

  if (!data) return <div>Algo deu errado</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const user = useUser();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data } = api.posts.getAll.useQuery(); // prefetch

  return (
    <>
      <Head>
        <title>Emotwit</title>
        <meta
          name="description"
          content="O espaço para você gastar todos os seus emojis"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center">
        <div className="h-screen w-full border-x border-[#2f3336] md:max-w-2xl">
          <div className=" border-b border-[#2f3336] p-4">
            {!user.isSignedIn && (
              <div className="flex justify-end">
                {" "}
                <SignInButton />{" "}
              </div>
            )}
            {!!user.isSignedIn && (
              <div className="flex">
                {" "}
                <CreatePostWizard />
              </div>
            )}
          </div>
          <Feed />
        </div>
      </main>
    </>
  );
};

export default Home;
