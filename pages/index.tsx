import Head from "next/head";
import Form from "../components/form"
import { Heading } from "@chakra-ui/react"

const siteTitle = "5chログをツリー表示にするやつ";
export default function Home() {
  return (
    <div className="bg-gray-100">
    <div className="max-w-screen-md min-h-screen mx-auto p-4 bg-white">
      <Head>
        <title>5chtree</title>
        <link rel="icon" href="/favicon.ico" />
        <meta
          property="og:image"
          content={`https://i.imgur.com/gWO11lUm.png`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary" />
      </Head>
      <main>
        <div className="flex justify-center mb-12 mt-8">
          <Heading>5chログをツリー表示にするやつ β版</Heading>
        </div>
        <Form/>
      </main>
    </div>
    </div>
  );
}
