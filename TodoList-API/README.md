# How to run this project
1. Clone this repository
2. Run `npm install`
3. Create a `.env` file and add the following:
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```
4. Run `npm run dev`
5. Test the API using Postman or any API testing tool

# API Endpoints
## Auth
- POST /api/user/register
- POST /api/user/login

## Todos
- POST /api/todo
- PUT /api/todo/:id
- DELETE /api/todo/:id
- GET /api/todo

https://roadmap.sh/projects/todo-list-api