import Logo from "@/components/global/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Github } from "lucide-react";
import { Link } from "react-router";

const LandingPage = () => {
  return (
    <>
      <header className="p-4 flex flex-wrap gap-4 justify-between items-center border-b">
        <Logo
          showText
          asLink
          imageClassName="size-8"
          className="flex items-center gap-2 flex-row text-sm"
        />
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem asChild>
              <Button asChild variant="ghost">
                <a href="#features">Features</a>
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem asChild>
              <Button asChild variant="ghost">
                <Link to="/catalog">Course Catalogue</Link>
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem asChild>
              <Button asChild variant="ghost">
                <a href="#contributors">Contributors</a>
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="space-x-2">
        <ModeToggle />
        <Link to="/login"><Button>Login</Button></Link>
        </div>
      </header>
      <section className="min-h-[65vh] px-5 py-20 flex items-center justify-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
          <div className="text-center space-y-2">
            <h1 className="font-bold text-3xl">
              One place for your academic life
            </h1>
            <p className="text-base text-pretty">
              Track courses, assignments, deadlines, and notes, without need for
              WhatsApp, Google Drive, and scattered tools.
            </p>
            <p className="text-sm text-gray-600">
              Courses, resources, conversations, and deadlines in one workspace.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild>
              <Link to="/signup">Get started for free</Link>
            </Button>
            <Button variant="secondary" asChild><Link to="/catalog">Browse courses</Link></Button>
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-5 py-8 text-center" id="contributors"><h2 className="text-xl font-bold mb-3">Original application contributors</h2><p className="text-muted-foreground">Marwan Mohammed · Abdulrahman Jalal · Moslem Ahmed</p></section>
      <section id="features" className="max-w-6xl mx-auto px-5 py-16">
        <h2 className="text-3xl font-bold mb-3 text-center">Everything you need for the semester</h2>
        <p className="text-muted-foreground text-center mb-8">Your courses, conversations, and coursework together in UniConnect.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            ["Courses & study groups", "Join courses and discuss questions with classmates and instructors."],
            ["A complete resource library", "Find lecture guides, tutorials, problem sheets, quizzes, assignments, and reading companions."],
            ["Assignments & feedback", "Upload your work, track submission status, and see instructor grades and feedback."],
            ["Calendar & deadlines", "Keep upcoming quizzes, exams, workshops, and project milestones in view."],
            ["Announcements & polls", "Read class updates, follow course announcements, and vote on learning activities."],
            ["Teaching & administration", "Create courses, manage materials, approve instructors, and view campus statistics."]
          ].map(([title, description]) => <Card key={title}><CardContent><h3 className="font-semibold mb-2">{title}</h3><p className="text-sm text-muted-foreground">{description}</p></CardContent></Card>)}
        </div>
        <div className="text-center mt-8"><Button asChild><Link to="/catalog">Explore all subject categories</Link></Button></div>

      </section>
      <footer className="flex items-center justify-between bg-muted border-t p-3 flex-wrap gap-3">
        <Logo asLink />
        <p>Made with ❤ by students, to students.</p>
        <div className="flex items-center gap-2">
          {Object.entries(LANDING_PAGE_HREF_TO_TEXT).map(([href, text]) => (
            <a key={href} href={href} className="underline hover:no-underline">
              {text}
            </a>
          ))}
          <a
            href="https://github.com/mohamedhany-44/UniComnect_test"
            title="Visit GitHub repo"
          >
            <Github aria-label="App GitHub" />
          </a>
        </div>
      </footer>
    </>
  );
};

const LANDING_PAGE_HREF_TO_TEXT = {
  "#features": "Features",
  "/catalog": "Course Catalogue",
  "#contributors": "Contributors",
};

export default LandingPage;
