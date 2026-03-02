import { Search, Plus, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { StatusBadge } from "../../components/StatusBadge";

const students = [
  { id: 1, name: "Emma Thompson", grade: "Grade 5", route: "Route A - Maple District", bus: "Bus #12", parent: "Jane Thompson", status: "active" },
  { id: 2, name: "Liam Martinez", grade: "Grade 3", route: "Route B - Oak Valley", bus: "Bus #7", parent: "Carlos Martinez", status: "active" },
  { id: 3, name: "Olivia Johnson", grade: "Grade 6", route: "Route C - Pine Heights", bus: "Bus #3", parent: "Robert Johnson", status: "active" },
  { id: 4, name: "Noah Williams", grade: "Grade 4", route: "Route A - Maple District", bus: "Bus #12", parent: "Susan Williams", status: "inactive" },
  { id: 5, name: "Ava Brown", grade: "Grade 2", route: "Route D - Cedar Park", bus: "Bus #15", parent: "Michael Brown", status: "active" },
  { id: 6, name: "Ethan Davis", grade: "Grade 7", route: "Route E - Birch Lane", bus: "Bus #9", parent: "Patricia Davis", status: "active" },
];

export default function AdminStudents() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-foreground">Students</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage student transport assignments</p>
        </div>
        <Button className="bg-primary text-white gap-2 self-start">
          <Plus className="size-4" />
          Add Student
        </Button>
      </div>

      <Card className="border-border">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 bg-secondary rounded-xl px-3 py-2 flex-1">
              <Search className="size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search students..."
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground"
              />
            </div>
            <Button variant="outline" className="gap-2 self-start">
              <Filter className="size-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-3 text-muted-foreground">Student</th>
                  <th className="text-left py-3 px-3 text-muted-foreground hidden sm:table-cell">Grade</th>
                  <th className="text-left py-3 px-3 text-muted-foreground hidden md:table-cell">Route</th>
                  <th className="text-left py-3 px-3 text-muted-foreground hidden lg:table-cell">Parent</th>
                  <th className="text-left py-3 px-3 text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-border/50 last:border-0 hover:bg-accent/30 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-xs text-primary">
                            {student.name.split(" ").map((n) => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <p className="text-foreground">{student.name}</p>
                          <p className="text-xs text-muted-foreground sm:hidden">{student.grade}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground hidden sm:table-cell">{student.grade}</td>
                    <td className="py-3 px-3 text-muted-foreground hidden md:table-cell">{student.route}</td>
                    <td className="py-3 px-3 text-muted-foreground hidden lg:table-cell">{student.parent}</td>
                    <td className="py-3 px-3">
                      <StatusBadge status={student.status === "active" ? "success" : "neutral"}>
                        {student.status === "active" ? "Active" : "Inactive"}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
