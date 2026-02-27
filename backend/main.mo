import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Array "mo:core/Array";

actor {
  type ProjectStatus = {
    #planning;
    #inProgress;
    #completed;
  };

  type TaskStatus = {
    #toDo;
    #inProgress;
    #done;
  };

  type Project = {
    id : Nat;
    name : Text;
    description : Text;
    status : ProjectStatus;
    startDate : Text;
    endDate : Text;
    budget : Nat;
    taskIds : [Nat];
    clientId : Nat;
  };

  module Project {
    public func compare(project1 : Project, project2 : Project) : Order.Order {
      Nat.compare(project1.id, project2.id);
    };

    public func compareByName(project1 : Project, project2 : Project) : Order.Order {
      Text.compare(project1.name, project2.name);
    };
  };

  type Task = {
    id : Nat;
    projectId : Nat;
    title : Text;
    assignee : Text;
    dueDate : Text;
    status : TaskStatus;
  };

  type Client = {
    id : Nat;
    name : Text;
    phone : Text;
    email : Text;
    projectIds : [Nat];
  };

  module Client {
    public func compare(client1 : Client, client2 : Client) : Order.Order {
      Nat.compare(client1.id, client2.id);
    };
  };

  var nextProjectId = 0;
  var nextTaskId = 0;
  var nextClientId = 0;

  let projects = Map.empty<Nat, Project>();
  let tasks = Map.empty<Nat, Task>();
  let clients = Map.empty<Nat, Client>();

  // Project functions
  public shared ({ caller }) func createProject(name : Text, description : Text, status : ProjectStatus, startDate : Text, endDate : Text, budget : Nat, clientId : Nat) : async Nat {
    let projectId = nextProjectId;
    nextProjectId += 1;

    let project : Project = {
      id = projectId;
      name;
      description;
      status;
      startDate;
      endDate;
      budget;
      taskIds = [];
      clientId;
    };

    projects.add(projectId, project);
    projectId;
  };

  public query ({ caller }) func getProject(projectId : Nat) : async Project {
    switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found") };
      case (?project) { project };
    };
  };

  public shared ({ caller }) func updateProjectStatus(projectId : Nat, newStatus : ProjectStatus) : async () {
    switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found") };
      case (?project) {
        let updatedProject = {
          project with
          status = newStatus;
        };
        projects.add(projectId, updatedProject);
      };
    };
  };

  // Task functions
  public shared ({ caller }) func createTask(projectId : Nat, title : Text, assignee : Text, dueDate : Text, status : TaskStatus) : async Nat {
    let taskId = nextTaskId;
    nextTaskId += 1;

    let task : Task = {
      id = taskId;
      projectId;
      title;
      assignee;
      dueDate;
      status;
    };

    tasks.add(taskId, task);

    let project = switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found") };
      case (?p) { p };
    };
    let updatedTaskIds = project.taskIds.concat([taskId]);
    let updatedProject = {
      project with
      taskIds = updatedTaskIds;
    };
    projects.add(projectId, updatedProject);

    taskId;
  };

  public query ({ caller }) func getTask(taskId : Nat) : async Task {
    switch (tasks.get(taskId)) {
      case (null) { Runtime.trap("Task not found") };
      case (?task) { task };
    };
  };

  public shared ({ caller }) func updateTaskStatus(taskId : Nat, newStatus : TaskStatus) : async () {
    switch (tasks.get(taskId)) {
      case (null) { Runtime.trap("Task not found") };
      case (?task) {
        let updatedTask = {
          task with
          status = newStatus;
        };
        tasks.add(taskId, updatedTask);
      };
    };
  };

  // Client functions
  public shared ({ caller }) func createClient(name : Text, phone : Text, email : Text) : async Nat {
    let clientId = nextClientId;
    nextClientId += 1;

    let client : Client = {
      id = clientId;
      name;
      phone;
      email;
      projectIds = [];
    };

    clients.add(clientId, client);
    clientId;
  };

  public query ({ caller }) func getClient(clientId : Nat) : async Client {
    switch (clients.get(clientId)) {
      case (null) { Runtime.trap("Client not found") };
      case (?client) { client };
    };
  };

  public query ({ caller }) func getAllClients() : async [Client] {
    clients.values().toArray().sort(); // implicitly uses Client.compare
  };

  public query ({ caller }) func getAllProjects() : async [Project] {
    projects.values().toArray().sort(); // implicitly uses Project.compare
  };
};
