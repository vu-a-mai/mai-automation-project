*** Settings ***
Library    libraries.CustomKeywordsLibrary


*** Variables ***
# Default to production, can be overridden via command line:
# robot --pythonpath . -v URL:http://localhost:3000 tests/web
${URL}      https://mai-automation-project.vercel.app
${EMAIL}    test@test.com
${PASSWORD}    password


*** Test Cases ***

Login And Add Todo
    Open Browser
    Go To Page    ${URL}
    Login    ${EMAIL}    ${PASSWORD}
    Add Todo    Learn Robot Framework
    Verify Todo Visible    Learn Robot Framework
    Close Browser

Complete Todo
    Open Browser
    Go To Page    ${URL}
    Login    ${EMAIL}    ${PASSWORD}
    Add Todo    Complete This Task
    Complete Todo    Complete This Task
    Close Browser

Delete Todo
    Open Browser
    Go To Page    ${URL}
    Login    ${EMAIL}    ${PASSWORD}
    Add Todo    Delete Me
    Delete Todo    Delete Me
    Verify Todo Not Visible    Delete Me
    Close Browser

Filter Active Todos
    Open Browser
    Go To Page    ${URL}
    Login    ${EMAIL}    ${PASSWORD}
    Add Todo    Active Task 1
    Add Todo    Active Task 2
    Complete Todo    Active Task 1
    Filter Todos    active
    ${count}=    Count Todos
    Should Be Equal As Integers    ${count}    3
    Close Browser

Filter Completed Todos
    Open Browser
    Go To Page    ${URL}
    Login    ${EMAIL}    ${PASSWORD}
    Clear All Todos
    Add Todo    Task One
    Add Todo    Task Two
    Complete Todo    Task One
    Filter Todos    completed
    ${count}=    Count Todos
    Should Be Equal As Integers    ${count}    1
    Close Browser

Add Multiple Todos
    Open Browser
    Go To Page    ${URL}
    Login    ${EMAIL}    ${PASSWORD}
    Clear All Todos
    Add Todo    First Todo
    Add Todo    Second Todo
    Add Todo    Third Todo
    ${count}=    Count Todos
    Should Be Equal As Integers    ${count}    3
    Close Browser

Complete All Todos
    Open Browser
    Go To Page    ${URL}
    Login    ${EMAIL}    ${PASSWORD}
    Clear All Todos
    Add Todo    Todo 1
    Add Todo    Todo 2
    Add Todo    Todo 3
    Complete Todo    Todo 1
    Complete Todo    Todo 2
    Complete Todo    Todo 3
    Filter Todos    completed
    ${count}=    Count Todos
    Should Be Equal As Integers    ${count}    3
    Close Browser

Delete All Todos
    Open Browser
    Go To Page    ${URL}
    Login    ${EMAIL}    ${PASSWORD}
    Add Todo    Temp Todo 1
    Add Todo    Temp Todo 2
    Clear All Todos
    ${count}=    Count Todos
    Should Be Equal As Integers    ${count}    0
    Close Browser

Switch Between Filters
    Open Browser
    Go To Page    ${URL}
    Login    ${EMAIL}    ${PASSWORD}
    Clear All Todos
    Add Todo    Mixed Todo 1
    Add Todo    Mixed Todo 2
    Complete Todo    Mixed Todo 1
    Filter Todos    active
    Verify Todo Visible    Mixed Todo 2
    Filter Todos    completed
    Verify Todo Visible    Mixed Todo 1
    Filter Todos    all
    ${count}=    Count Todos
    Should Be Equal As Integers    ${count}    3
    Close Browser
