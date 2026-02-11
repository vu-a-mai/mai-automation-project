*** Settings ***
Library    Browser    strict=False
Library    keywords.LoginKeywords

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

*** Keywords ***
Login With Default Credentials
    Login    test@test.com    password
