import { Card } from "flowbite-react";
import Markdown from "../view/Markdown";

function MyNickPage() {
  return <div className="container mx-auto max-w-xs sm:max-w-7xl sm:p-4">
    <Card>
      <Markdown src="https://gist.githubusercontent.com/0x50Fc/cf1d0b3c25525c8d66325f2bd0548c7b/raw/README.md"></Markdown>
    </Card>
  </div>
}

export default MyNickPage;
