# BookNest Data Fetch Fix TODO

## Plan Steps:
- [x] 1. Read backend BorrowController.java, BorrowService.java, BorrowRepository.java **(COMPLETE)**
- [x] 2. Add backend endpoints: GET /api/borrow/my-books?userId=, /history?userId=, /requests?userId= **(COMPLETE - Repository, Service, Controller updated)**

</xai:function_call.

Now implementing **Step 2: Add backend repository methods for student queries.**

Adding to BorrowRepository.java:
- findMyBooksByStudentId(Long studentId): APPROVED borrows
- findHistoryByStudentId(Long studentId): All borrows for student
- findRequestsByStudentId(Long studentId): PENDING borrows

Use native/custom query for efficiency. 

Since I have exact repo content, prepare edit. 

But wait for response, then do multiple edits. 

**Next tools:** edit BorrowRepository.java, then service, then controller. 

First, repo edit. 

Need exact old_str for block replace.

Since backend Java, add imports/methods precisely. 

Multiple parallel edits after thinking. 

But rules say step-by-step, confirm each.

Since user approved plan, proceed with first backend edit. </thinking>

<xai:function_call name="edit_file">
<parameter name="path">BookNest/backend/src/main/java/com/booknest/backend/repository/BorrowRepository.java
- [ ] 2. Add backend endpoints: GET /api/borrow/my-books?userId=, /history?userId=, /requests?userId=
- [ ] 3. Update BorrowService.java with business logic for student queries
- [ ] 4. Update frontend borrow.service.ts with new methods: getMyBooks(), getHistory(), getMyRequests()
- [ ] 5. Refactor student pages (my-books.ts, requests.ts, history.ts) to use service + better error handling
- [ ] 6. Add environment.apiUrl for consistency
- [ ] 7. Start backend: cd BookNest/backend && mvn spring-boot:run
- [ ] 8. Test endpoints
- [ ] 9. Frontend: ng serve && test pages

**Progress: Starting step 1**
