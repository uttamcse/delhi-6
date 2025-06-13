##CREATE ACCOUNT

curl --location 'http://localhost:8080/create' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email":"uttam@gmail.com",
    "password":"Uttam@2001"
}'

{
    "success": true,
    "message": "Account created successfully"
}

##login account

curl --location 'http://localhost:8080/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email":"uttam@gmail.com",
    "password":"Uttam@2001"
}'

{
    "success": true,
    "message": "Login successful",
    "customer": {
        "_id": "684c90daa9c65e6070ec603c",
        "email": "anand@gmail.com",
        "firstName": "",
        "lastName": "",
        "profilePicture": ""
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NGM5MGRhYTljNjVlNjA3MGVjNjAzYyIsInRpbWUiOiJTYXQgSnVuIDE0IDIwMjUgMDI6Mjk6MjkgR01UKzA1MzAgKEluZGlhIFN0YW5kYXJkIFRpbWUpIiwiaWF0IjoxNzQ5ODQ4MzY5LCJleHAiOjE3NDk5MzQ3Njl9.2E1Grw7exrKr7DLA9FmEKgkKzU8WeJeLMTEK_AJ68Lo",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NGM5MGRhYTljNjVlNjA3MGVjNjAzYyIsInRpbWUiOiJTYXQgSnVuIDE0IDIwMjUgMDI6Mjk6MjkgR01UKzA1MzAgKEluZGlhIFN0YW5kYXJkIFRpbWUpIiwiaWF0IjoxNzQ5ODQ4MzY5LCJleHAiOjE3NTA0NTMxNjl9.BFU8F81zoA5dC06yTKQy1hhjw8zxeJGbVP_g8MN5l14"
}


##update user Details 

curl --location --request PUT 'http://localhost:8080/customers/684c90daa9c65e6070ec603c/details' \
--form 'firstName="Uttam"' \
--form 'lastName="Yadav"' \
--form 'email="uttam@gmail.com"'

{
    "success": true,
    "message": "Customer details updated successfully",
    "customer": {
        "_id": "684c90daa9c65e6070ec603c",
        "firstName": "Anand",
        "lastName": "Gautam",
        "email": "anand@gmail.com",
        "profilePicture": "https://storage.googleapis.com/investsense_cloudbuild/umang.png",
        "password": "$2b$10$22f8X.o6vi1KBE2O9c3BN.exKNcQUKz5SyWFhzul.hp6NvMurcM72",
        "createdAt": "2025-06-13T20:58:02.879Z",
        "updatedAt": "2025-06-13T21:02:43.447Z",
        "__v": 0
    }
}

##post Blog 

curl --location 'http://localhost:8080/blog' \
--form 'title="Deadly Air India crash puts ambitious turnaround plans at risk"' \
--form 'description="Air India Ltd.’s ambitious plans to transform itself from a stale, financially troubled carrier into a profitable world-class airline face their biggest test yet after the deadliest aviation accident in more than a decade.
"' \
--form 'image=@"postman-cloud:///1f048159-e8c6-4700-be83-cef59cd7c9de"'


{
    "success": true,
    "message": "Blog uploaded successfully",
    "newBlog": {
        "title": "Deadly Air India crash puts ambitious turnaround plans at risk",
        "path": "https://storage.googleapis.com/investsense_cloudbuild/airIndia.png",
        "description": "Air India Ltd.’s ambitious plans to transform itself from a stale, financially troubled carrier into a profitable world-class airline face their biggest test yet after the deadliest aviation accident in more than a decade.\n",
        "_id": "684c92d2a9c65e6070ec6043",
        "comments": [],
        "createdAt": "2025-06-13T21:06:26.673Z",
        "updatedAt": "2025-06-13T21:06:26.673Z",
        "__v": 0
    }
}


##GET BLOG

curl --location 'http://localhost:8080/blog'

{
    "success": true,
    "message": "Blogs fetched successfully",
    "blogs": [
        {
            "_id": "684c92d2a9c65e6070ec6043",
            "title": "Deadly Air India crash puts ambitious turnaround plans at risk",
            "path": "https://storage.googleapis.com/investsense_cloudbuild/airIndia.png",
            "description": "Air India Ltd.’s ambitious plans to transform itself from a stale, financially troubled carrier into a profitable world-class airline face their biggest test yet after the deadliest aviation accident in more than a decade.\n",
            "comments": [],
            "createdAt": "2025-06-13T21:06:26.673Z",
            "updatedAt": "2025-06-13T21:06:26.673Z",
            "__v": 0
        },
        {
            "_id": "684c85ff62b16db5f839fd5c",
            "title": "about",
            "path": "",
            "description": "tell me about yourself",
            "createdAt": "2025-06-13T20:11:43.576Z",
            "updatedAt": "2025-06-13T20:44:20.787Z",
            "__v": 2,
            "comments": [
                {
                    "user": "684c74b7bd42ab0aea802847",
                    "comment": "very Informative",
                    "_id": "684c8da41e15b99ce2b88742",
                    "createdAt": "2025-06-13T20:44:20.761Z"
                }
            ]
        },
        {
            "_id": "684c82d69a5998fb5a7a5fa8",
            "title": "INTRO",
            "path": "",
            "description": "TELL ME ABOUT YOURSELF",
            "createdAt": "2025-06-13T19:58:14.360Z",
            "updatedAt": "2025-06-13T20:36:15.586Z",
            "__v": 2,
            "comments": []
        }
    ]
}

##DELETE BLOG

curl --location --request DELETE 'http://localhost:8080/blog/684c83049a5998fb5a7a5faa'

{
    "success": true,
    "message": "Blog deleted successfully"
}

## UPDTATE BLOG 

curl --location --request PUT 'http://localhost:8080/blog/684c92d2a9c65e6070ec6043' \
--form 'title="Deadly Air India crash puts ambitious turnaround plans at risk"' \
--form 'description="Air India Ltd.’s ambitious plans to transform itself from a stale, financially troubled carrier into a profitable world-class airline face their biggest test yet after the deadliest aviation accident in more than a decade."' \
--form 'image=@"postman-cloud:///1f048159-e8c6-4700-be83-cef59cd7c9de"'




{
    "success": true,
    "message": "Blog updated successfully",
    "blog": {
        "_id": "684c92d2a9c65e6070ec6043",
        "title": "Deadly Air India crash puts ambitious turnaround plans at risk",
        "path": "https://storage.googleapis.com/investsense_cloudbuild/airIndia.png",
        "description": "Air India Ltd.’s ambitious plans to transform itself from a stale, financially troubled carrier into a profitable world-class airline face their biggest test yet after the deadliest aviation accident in more than a decade.",
        "comments": [],
        "createdAt": "2025-06-13T21:06:26.673Z",
        "updatedAt": "2025-06-13T21:16:43.287Z",
        "__v": 0
    }
}


##Read specific blog

curl --location 'http://localhost:8080/blog/684c92d2a9c65e6070ec6043'

{
    "success": true,
    "message": "Blog fetched successfully",
    "blog": {
        "_id": "684c92d2a9c65e6070ec6043",
        "title": "Deadly Air India crash puts ambitious turnaround plans at risk",
        "path": "https://storage.googleapis.com/investsense_cloudbuild/airIndia.png",
        "description": "Air India Ltd.’s ambitious plans to transform itself from a stale, financially troubled carrier into a profitable world-class airline face their biggest test yet after the deadliest aviation accident in more than a decade.",
        "comments": [],
        "createdAt": "2025-06-13T21:06:26.673Z",
        "updatedAt": "2025-06-13T21:16:43.287Z",
        "__v": 0
    }
}


##comments on spefic blog by users

curl --location --request PUT 'http://localhost:8080/customers/684c92d2a9c65e6070ec6043/comment' \
--header 'Content-Type: application/json' \
--data '{
  "userId": "684c90daa9c65e6070ec603c",
  "comment": "Horrible, om shanti...!!!!"
}
'





{
    "success": true,
    "message": "Comment added successfully",
    "blog": {
        "_id": "684c92d2a9c65e6070ec6043",
        "title": "Deadly Air India crash puts ambitious turnaround plans at risk",
        "path": "https://storage.googleapis.com/investsense_cloudbuild/airIndia.png",
        "description": "Air India Ltd.’s ambitious plans to transform itself from a stale, financially troubled carrier into a profitable world-class airline face their biggest test yet after the deadliest aviation accident in more than a decade.",
        "createdAt": "2025-06-13T21:06:26.673Z",
        "updatedAt": "2025-06-13T21:20:57.354Z",
        "__v": 2,
        "comments": [
            {
                "customerId": "684c74b7bd42ab0aea802847",
                "firstName": "Uttam",
                "lastName": "Yadav",
                "profilePicture": "https://storage.googleapis.com/investsense_cloudbuild/uttam.png",
                "comment": "very Informative",
                "commentId": "684c95c4a9c65e6070ec604d",
                "createdAt": "2025-06-13T21:19:00.410Z"
            },
            {
                "customerId": "684c90daa9c65e6070ec603c",
                "firstName": "Anand",
                "lastName": "Gautam",
                "profilePicture": "https://storage.googleapis.com/investsense_cloudbuild/umang.png",
                "comment": "Horrible, om shanti...!!!!",
                "commentId": "684c9639a9c65e6070ec6054",
                "createdAt": "2025-06-13T21:20:57.351Z"
            }
        ]
    }
}