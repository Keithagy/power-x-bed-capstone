// Create a TODO-list CRUD API with these below endpoints:
// *	[Public] A registration endpoint that would accept an email and password, and rejects any emails that have been registered before
//          POST /register

// *	[Public] A login endpoint that would return a JSON Web token that could be used on authenticated endpoint
//          POST /login

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// *	[Auth-ed] CRUD endpoints for TODO lists:
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// *	A Create endpoint with the list being created belongs to and can only be accessed by the creator or anyone added to access the list 
// !        Use uid from request (added by authMiddleWare)
//          POST /lists

// *	A GET all TODO-list endpoint that would return an array of TODO-lists with their titles based on who the currently authenticated user is
// !        Use uid from request (added by authMiddleWare)
//          GET /lists

// *	A GET a single TODO-list by its ID endpoint that would return the corresponding TODO-list together with all of the items in the list based on // *    who the current authenticated user is. Returns 403 forbidden with a proper error JSON object if the user cannot access the list
// !        Permissioned: req.uid must be in todoList.creator or todoList.accessibleTo
//          GET /lists/{listId}

// *	A PUT/PATCH endpoint to update a TODO-list’s title by its ID based on who the current authenticated user is. 
// *    Returns 403 forbidden with a proper error JSON object if the user cannot access the list
// !        Permissioned: req.uid must be in todoList.creator
//          PUT /lists/{listId}

// *	A DELETE endpoint to remove a TODO-list. Soft-delete should be used
// !        Permissioned: req.uid must be in todoList.creator
//          DELETE /lists/{listId}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// *	[Auth-ed] An endpoint to add someone by email to be able to access a TODO list:
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// *	This operation should be processed in an event-driven manner: 
// *    The endpoint would immediate respond with an appropriate 200 JSON response after putting an event into a message broker
// *    (Recommended rabbitmq as there’s a free plan)
//  	    There will be a separate worker process that would consume the message and:
//  	    Do nothing if there’s no existing user with such email
//  	    Give the corresponding user with such email access to the list
//  	    Requeue the message if there are errors during processing
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// *	[Auth-ed] CUD endpoints for items in a TODO list, only for those with access to the specific list:
//  	Note: There’s no R endpoint as that’s been covered in the TODO-list CRUD endpoint
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// *	Create an item in the list
// !        Permissioned: req.uid must be in todo.parent.creator
//          POST /todos

// *	Update an item in the list
// !        Permissioned: req.uid must be in todo.parent.creator
//          PUT /todos/{todoId}
//          If todo.parent is null, edit item in existing list
//          If todo.parent has a value, move item from one list to another

// *	Delete an item from the list. Soft delete should be used
// !        Permissioned: req.uid must be in todo.parent.creator
//          DELETE /todos/{todoId}

require('dotenv').config();
const App = require('./app');
const Router = require('./routes/index');
const AuthMiddleware = require('./middleware/auth')
const AuthService = require('./services/auth');
const listPermissions = require('./middleware/listPermissions')
const todoPermissions = require('./middleware/todoPermissions')
const permissions = {listPermissions, todoPermissions}
const listService = require('./services/list')
const todoService = require('./services/todo')
const db = require('./db');
(async () => await db.initialise())();

const authService = AuthService(db);
const authMiddleware = AuthMiddleware(authService)
const router = Router(authMiddleware, authService, permissions, listService, todoService);
const app = App(router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

// (authMiddleware, authService, permissions, listService, todoService)