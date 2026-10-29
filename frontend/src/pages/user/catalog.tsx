import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Search, ArrowRight, Users, GraduationCap } from "lucide-react";
import api from "@/lib/axios";
import { useAuth } from "@/providers/context/authContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Logo from "@/components/global/Logo";
import { toast } from "sonner";

type Course={code:string;name:string;year:string;description:string;department:string;color:string;teachers:string[];students:number;image_url:string|null};
export default function Catalog(){
  const {auth}=useAuth(),client=useQueryClient();
  const [search,setSearch]=useState(""),[department,setDepartment]=useState("All subjects"),[year,setYear]=useState("");
  const {data,isPending,isError,refetch}=useQuery({queryKey:["campus-catalog"],queryFn:async()=>(await api.get<{departments:string[];courses:Course[]}>("/api/catalog")).data});
  const isStudent=!!auth.user&&["student","class_representative","course_head"].includes(auth.user.role);
  const joined=useQuery({queryKey:["catalog-enrollments",auth.user?.id],enabled:isStudent,queryFn:async()=>(await api.get<{data:{code:string}[]}>("/api/me/courses/enrolled")).data.data});
  const join=useMutation({mutationFn:async(code:string)=>api.post(`/api/courses/${encodeURIComponent(code)}/enrollments`),onSuccess:()=>{client.invalidateQueries({queryKey:["catalog-enrollments"]});client.invalidateQueries({queryKey:["student-courses"]});client.invalidateQueries({queryKey:["campus-catalog"]});toast.success("Course joined. Your materials, assignments, and group are ready.")},onError:()=>toast.error("Could not join this course. Please try again.")});
  const courses=useMemo(()=>(data?.courses||[]).filter(c=>(department==="All subjects"||c.department===department)&&(!year||c.year===year)&&`${c.name} ${c.code} ${c.description} ${c.teachers.join(" ")}`.toLowerCase().includes(search.toLowerCase())),[data,department,year,search]);
  const home=auth.user?.role==="system_admin"?"/admin/dashboard":auth.user?.role==="professor/ta"?"/instructor/courses":"/student/dashboard";
  return <div className="min-h-screen bg-background text-foreground">
    <header className="border-b"><div className="max-w-7xl mx-auto px-5 py-4 flex flex-wrap gap-3 items-center justify-between"><Logo showText asLink imageClassName="size-8" className="flex flex-row items-center gap-2 text-lg"/><nav className="flex items-center gap-2"><ModeToggle/><Button variant="ghost" asChild><Link to={auth.user?home:"/login"}>{auth.user?"My workspace":"Sign in"}</Link></Button>{!auth.user&&<Button asChild><Link to="/signup">Create account</Link></Button>}</nav></div></header>
    <section className="border-b bg-muted/40"><div className="max-w-7xl mx-auto px-5 py-12 md:py-16"><p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">The UniConnect campus</p><h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Find your next subject.</h1><p className="max-w-2xl text-muted-foreground text-lg">Explore courses, meet your study group, and keep your learning in one place. From your first lecture to your graduation project.</p><div className="flex flex-wrap gap-6 mt-7 text-sm"><span className="flex gap-2 items-center"><BookOpen size={18}/>{data?.courses.length??"—"} courses</span><span className="flex gap-2 items-center"><GraduationCap size={18}/>{data?.departments.length??"—"} subject categories</span><span>Lectures · Tutorials · Sheets · Quizzes · Assignments · Reading</span></div></div></section>
    <main className="max-w-7xl mx-auto px-5 py-8">
      <div className="flex flex-col md:flex-row gap-3 mb-6"><div className="relative flex-1"><Search className="absolute left-3 top-3 text-muted-foreground" size={18}/><Input aria-label="Search courses" className="pl-10 h-11" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search courses, topics, or instructors…"/></div><select aria-label="Academic year" className="h-11 rounded-md border bg-background px-3 text-sm" value={year} onChange={e=>setYear(e.target.value)}><option value="">All academic years</option>{[1,2,3,4,5].map(y=><option key={y} value={y}>Year {y}</option>)}</select></div>
      <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Subject categories">{["All subjects",...new Set(data?.courses.map(c=>c.department))].map(d=><Button key={d} size="sm" variant={d===department?"default":"outline"} aria-pressed={d===department} onClick={()=>setDepartment(d)}>{d}</Button>)}</div>
      {isPending?<p role="status">Loading courses…</p>:isError?<div role="alert">Could not load the catalogue. <Button variant="outline" onClick={()=>refetch()}>Try again</Button></div>:<><p className="text-sm text-muted-foreground mb-4">{courses.length} {courses.length===1?"course":"courses"} found</p><div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">{courses.map(c=>{
        const enrolled=joined.data?.some(x=>x.code===c.code);
        return <article key={c.code} className="rounded-xl border bg-card overflow-hidden flex flex-col hover:shadow-md transition-shadow">
          {c.image_url?<img src={c.image_url} alt="" className="w-full h-32 object-cover" loading="lazy"/>:<div className="h-32 flex items-center px-6 text-white" style={{background:c.color}}><BookOpen size={40}/></div>}
          <div className="p-5 flex flex-col flex-1"><p className="text-xs font-medium text-primary mb-2">{c.department} · Year {c.year}</p><h2 className="font-semibold text-xl leading-tight mb-2">{c.name}</h2><p className="text-sm text-muted-foreground mb-4 flex-1">{c.description}</p><p className="text-xs text-muted-foreground mb-2">{c.teachers.join(" · ")||"Teaching team to be announced"}</p><div className="flex justify-between text-xs text-muted-foreground border-t pt-3 mb-4"><span>{c.code}</span><span className="flex gap-1 items-center"><Users size={14}/>{c.students} enrolled</span></div>
          {!auth.user?<Button asChild variant="outline"><Link to="/signup">Join the campus <ArrowRight size={16}/></Link></Button>:isStudent?enrolled?<Button asChild><Link to={`/student/courses/${c.code}`}>Open course <ArrowRight size={16}/></Link></Button>:<Button variant="outline" disabled={join.isPending} onClick={()=>join.mutate(c.code)}>Join course</Button>:<Button asChild variant="outline"><Link to={auth.user.role==="system_admin"?"/admin/courses":"/instructor/courses"}>Manage courses <ArrowRight size={16}/></Link></Button>}
          </div></article>;
      })}</div>{!courses.length&&<div className="border rounded-xl text-center p-12"><h2 className="text-lg font-semibold">No matching courses</h2><p className="text-muted-foreground mt-2 mb-4">Try another subject or a broader search.</p><Button variant="outline" onClick={()=>{setSearch("");setDepartment("All subjects");setYear("")}}>Clear filters</Button></div>}</>}
      <p className="text-xs text-muted-foreground mt-10 border-t pt-5">Browse subjects and join your courses. Your enrolments, coursework, and profile are saved to your account.</p>
    </main>
  </div>;
}
