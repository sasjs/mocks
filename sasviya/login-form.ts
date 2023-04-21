export const loginForm = `<!DOCTYPE html>
<html class="bg" lang="en" dir="ltr">
<head>
    
    <title>SAS&reg; Logon Manager</title>
    <link rel="shortcut icon" href="/SASLogon/resources/oss/images/favicon.ico" />
    <meta charset='utf-8' />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link type="text/css" href="/SASLogon/resources/oss/stylesheets/sas.css" rel="stylesheet" />
</head>
<body>
    <div class="content">
        <div id="nonModal" class="block">
        <div id="loginbox">

            <div >
        <div id="message" aria-live="assertive" aria-atomic="true" role="alert" hidden="hidden">
            
            
            
            
            
            
        </div>
    </div>

            <img src="resources/images/transparent.png" class="logo" alt="" />

            <div class="logocontainer" >
        <img src="/SASLogon/resources/images/saslogo.svg" class="logo" aria-label="SAS logo" alt="SAS logo" />
    </div>

            <form method="post" id="fm1" class="minimal" novalidate="novalidate" action="/SASLogon/login.do"><input type="hidden" name="X-Uaa-Csrf" value="Pu8HFegRYo3uBjmpxCDlZ1"/>
                <span class="userid">
                    <input id="username" name="username" placeholder="User ID" autofocus="true" type="text" value="" autocomplete="username" maxlength="500" aria-label="User ID" aria-describedby="error message1 message2 message_code message_code2"/>
                </span>

                <span class="password">
                    <input id="password" name="password" placeholder="Password" type="password" value="" size="25" maxlength="500" autocomplete="current-password" aria-label="Password"/>
                </span>

                <input type="hidden" name="_eventId" value="submit" aria-hidden="true" />
                <input type="submit" class="hidden" />

                <input type="hidden" name="msg_userpass_req" value="Please enter a user ID and password." aria-hidden="true" />
                <input type="hidden" name="msg_username_req" value="Please enter a user ID." aria-hidden="true" />
                <input type="hidden" name="msg_password_req" value="Please enter a password." aria-hidden="true" />

                
                
                
                

                <button type="button" id="submitBtn" class="btn-submit" title="Sign in">Sign in</button>
                

                <div class="saml-login" role="group" aria-labelledby="sign-in-options">
                    
                    
                    
                    
                </div>
            </form>
        </div>

        

        <script src="/SASLogon/resources/js/login.js"></script>
    </div>
    </div>

    <div class="footer">
        <div class="copyright">
            <span dir="ltr">&#x202a;&copy; 2020-2023, SAS Institute Inc., Cary, NC, USA. All Rights Reserved.&#x202c;</span>
            <a id="aboutLink" href="#openModal" class="about">About</a>
        </div>
    </div>

    <!--~~~~~~~~~~~~~~~~~~~~~ABOUT DIALOG MODAL CONTENT~~~~~~~~~~~~~~~~~-->

    <div id="openModal" class="modalDialog"><!--modal container-->
        <div dir="ltr">
            <div class="test" dir="auto">
                <div>&rlm;</div>
                <div><a id="aboutDoneLink" href="" class="done">Done</a></div><!--done button-->
            </div>
            <!-- about dialog content -->
            <br />
            <p class="aboutProductName">Product name: SAS<sup>&reg;</sup> Logon Manager</p>
            <h2>Legal Notices</h2>
            <p>&copy; 2020-2023, SAS Institute Inc., Cary, NC, USA. All Rights Reserved.
                This software is protected by copyright laws and international treaties.</p>
            <h3>U.S. Government Restricted Rights</h3>
            <p>Use, duplication or disclosure of this software and related documentation by the United States government is subject to the license terms of the Agreement with SAS Institute Inc. pursuant to, as applicable, FAR 12.212, DFAR 227.7202-1(a), DFAR 227.7202-3(a) and DFAR 227.7202-4 and, to the extent required under United States federal law, the minimum restricted rights as set out in FAR 52.227-19 (DEC 2007).</p>
            <h3>Third-Party Software Usage</h3>
            <p>The following is licensed under the Apache License, Version 2.0 (the "License"). You may not use these files except in compliance with the License. You may obtain a copy of the License at <a id="aboutLicenseLink" href="http://www.apache.org/licenses/LICENSE-2.0" class="white">http://www.apache.org/licenses/LICENSE-2.0</a>. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.</p>
            <h4>User Account and Authentication (UAA) Server</h4>
            <p>Copyright &copy; 2015-Present CloudFoundry.org Foundation, Inc. All Rights Reserved.</p>
            <p>This project may include a number of subcomponents with separate copyright notices and license terms. Your use of these subcomponents is subject to the terms and conditions of the subcomponent's license, as noted in the LICENSE file.</p>
        </div>
    </div>

    <div class="radiance"></div>

    <script src="/SASLogon/resources/js/main.js"></script>
</body>
</html>`