Question 1: 

Explain the output of the following code and why: 
 
Answer:  
 
“2” 

“1” 

SetTimeout is an async function – therefore when executed its callback is sent to the event loop cycle (concurrency model). It sits in the heap until after 100 miliseconds it is pushed to the queue, whereby the event loop will push it back onto the stack to be executed. 
 
As the stack will have nothing else on it at the time, the “1” will be presented at the right time. The time given is when the event loop should try and push it bac on the stack, but it can’t guarantee it.  
 
Question 2: 
 
Explain the output of the following code and why: 
 
Answer: 
 
10,9,8,7,6,5,4,3,2,1,0 
 
The function has created a loop, calling itself as long as the value of d is under 10. When we call the function within itself we are not re-assigning a value to d with d + 1, rather we are calculating the new value to be passed into the next call of foo. 
 
The reason we see 10 first, is because Javascript is procedural. It cannot execute the console log until the prior parts of its argument have been completed I.e. the foo call. Therefore each sub call of foo must be completed to allow its parent to complete and execute a console.log. The call stack therefore has 11 functions to be executed (no further because d is === 10 and not below it).  
 
Whenever a function is called and sent to the call stack, before it is executed on the call stack, a closure is created which stores within it all of the declared data with how they are defined at that point. Hence the value of d changes with each new function call and execution on the stack. 
 
Question3 .If nothing is provided to foo we want the default response to be 5. Explain the potential issue with the following code: 
 
The issue here is with what could be passed in as nothing. Javascript assigns truthy and falsy values to different values. For instance, passing in literally nothing results in undefined which in a conditional equates to false. Hence all works fine and we see 5. The problem is an empty array will become a truthy in a conditional. This would result in the empty array being returned not 5. 
 
We know we are expecting a integer, therefore we could modify the code to search for an integer and only accept d as true if it was one.  
 
Q4: Explain the output of the following code and why: 
 
This again is to do with closures. When foo is called it returns a function which automatically has a parent closure scoped to it – the brackets of foo. As this closure of the return function as had ‘a = 1’ passed into it (foo(1)), when the return function is called it will look for ‘a’ within its scope  and find a = 1. Hence we see 3 . 
 
q:5 Explain how the following function would be used: 
 
Most likely in a loop. The benefit of this function is that the setTimeout callback has been scoped to the outer function double. 
 
Therefore each time double was called in a loop, a new function with a new closure would be created. So when the event loop shoots the callback of the setTimeout onto the stack, after 100 miliseconds, it will use the value of a and done passed into it’s parent closure at the time of double being called.  
 
Loops cause problems if wrapper functions aren’t used. This is usually because of variables such as a, being scoped to the outer function of the loop. If no wrapper existed, the setTimeout callback would search within the function scope (of where the loop was called) for the value of ‘a’ on execution, which would likely have changed from when initially called. The use of a let value is a useful solution to the problem.  
