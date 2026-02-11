*** Settings ***
Library    Browser    strict=False
Library    keywords.LoginLibrary
Library    keywords.TodoLibrary

*** Test Cases ***
Login With Valid Credentials Should Succeed
    [Documentation]    Test login with valid credentials
    [Tags]    smoke    login
    Navigate To Login Page    http://localhost:3000
    Login With Default Credentials
    Verify Login Successful

Login With Custom Credentials
    [Documentation]    Test login with custom email and password
    [Tags]    login
    Navigate To Login Page
    Login    email=user@example.com    password=secret123
    Verify Login Successful

Login Page Should Be Visible
    [Documentation]    Verify login page elements are visible
    [Tags]    ui    login
    Navigate To Login Page
    Verify Login Page Visible

Add New Todo Should Be Successful
    [Documentation]    Login and add a new todo
    [Tags]    smoke    todo
    Navigate To Login Page
    Login With Default Credentials
    Verify Login Successful
    Add Todo    Learn Robot Framework
    Verify Todo Exists    Learn Robot Framework

Complete A Todo
    [Documentation]    Login, add todo, then complete it
    [Tags]    todo
    Navigate To Login Page
    Login With Default Credentials
    Add Todo    Test complete feature
    Complete Todo    Test complete feature

Delete A Todo
    [Documentation]    Login, add todo, then delete it
    [Tags]    todo
    Navigate To Login Page
    Login With Default Credentials
    Add Todo    To be deleted
    Delete Todo    To be deleted
    Verify Todo Not Exists    To be deleted

Filter Todos By Status
    [Documentation]    Test filtering todos
    [Tags]    todo    filter
    Navigate To Login Page
    Login With Default Credentials
    Add Todo    Active todo 1
    Add Todo    Active todo 2
    Complete Todo    Active todo 1
    Filter By Status    Active
    ${count}=    Get Todo Count
    Should Be Equal    ${count}    1

*** Keywords ***
Login With Default Credentials
    Login    test@test.com    password
