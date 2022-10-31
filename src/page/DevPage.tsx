import { Card } from "flowbite-react";
import Markdown from "../view/Markdown";

function DevPage() {
  return <div className="container mx-auto max-w-xs sm:max-w-7xl sm:p-4">
    <Card>
      <Markdown src="https://gist.githubusercontent.com/0x50Fc/e209ec595277e707fc7b6b312446dd80/raw/README.md"></Markdown>
    </Card>
  </div>
}

export default DevPage;
