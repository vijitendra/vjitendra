var guiStartButton: Texture2D;
function WaitForFixedUpdate(){

}
function OnGUI()
{
if (GUI.Button(Rect(15,15,80,40), guiStartButton))
{
Application.LoadLevel("CompleteScene");
}}


