#pragma strict
var centerOfMass : Vector3; 
var WheelColFR: WheelCollider;
var WheelColRL: WheelCollider;
var WheelColFL: WheelCollider;
var WheelColRR: WheelCollider;
var WheelColFLTransform : Transform;
var WheelColFRTransform : Transform;
var WheelColRLTransform : Transform;
var WheelColRRTransform : Transform;

var GuiSpeed : GUIText;



var currentSpeed: float;
var speedTorque : float; // Speed of Torque  var currentSpeed : float;
var maxReverseSpeed : float = 50;
var maxSpeed : float = 200;
var maxbrakeTorque = 50.0;


var needleSpeedMeter : Texture2D;





function Start ()
{
 
   GetComponent.<Rigidbody>().centerOfMass = centerOfMass;
  
      var hostData : HostData[] = MasterServer.PollHostList();
		Debug.Log("Games found: ");
		for(var element : HostData in hostData) {
			Debug.Log(element.gameName);
		}
}

function FixedUpdate () {
currentSpeed = (Mathf.PI * 2 *  WheelColRL.radius) *  WheelColRL.rpm * 60/1000;
currentSpeed = Mathf.Round(currentSpeed);

WheelColFL.steerAngle =10 * Input.GetAxis("Horizontal");
WheelColFR.steerAngle =10 * Input.GetAxis("Horizontal");

WheelColRL.motorTorque = speedTorque * Input.GetAxis("Vertical");
WheelColRR.motorTorque = speedTorque * Input.GetAxis("Vertical");

GuiSpeed.text = currentSpeed.ToString(); 
}

function Update ()
{
   

   CalculateSpeed ();
   MaxSpeed ();
   WheelRotation ();
   WheelPosition();
}


  function CalculateSpeed ()
  {
  currentSpeed = ((2 * 22/7 * WheelColRR.radius  *WheelColRR.rpm*60/1000) +  (2 * 22/7 * WheelColRL.radius  *WheelColRL.rpm*60/1000) + ( 2 * 22/7 * WheelColFR.radius  *WheelColFR.rpm*60/1000) + (2 * 22/7 * WheelColFL.radius  *WheelColFL.rpm*60/1000)) / 4;
  currentSpeed = Mathf.Round(currentSpeed); 
  }
   function MaxSpeed ()
   {
   if (currentSpeed >= maxSpeed  || currentSpeed <= -maxReverseSpeed)
   {
   WheelColRL.motorTorque  = 00;
    WheelColRR.motorTorque  = 00;
     WheelColRL.brakeTorque  = 50;
      WheelColRR.brakeTorque  = 50;
      }
      else
      {
       WheelColRL.motorTorque  = 50;
    WheelColRR.motorTorque  = 50;
     WheelColRL.brakeTorque  = 00;
      WheelColRR.brakeTorque  = 00;
      }
      }

    function WheelRotation()
    {
     WheelColFLTransform.Rotate(WheelColFL.rpm/60*360*Time.deltaTime,0,0);
     WheelColRLTransform.Rotate(WheelColRL.rpm/60*360*Time.deltaTime,0,0);
      WheelColRRTransform.Rotate(WheelColRR.rpm/60*360*Time.deltaTime,0,0);
       WheelColFRTransform.Rotate(WheelColFR.rpm/60*360*Time.deltaTime,0,0); 

        WheelColFLTransform.localEulerAngles.y = WheelColFL.steerAngle -  WheelColFLTransform.localEulerAngles.z;
         WheelColFRTransform.localEulerAngles.y = WheelColFR.steerAngle -  WheelColFRTransform.localEulerAngles.z;
     } 
     function WheelPosition()
     {
     var hit : RaycastHit;
     var wheelpos: Vector3;
     if(Physics.Raycast( WheelColFR.transform.position,-WheelColFR.transform.up,hit,WheelColFR.radius + WheelColFR.suspensionDistance))
     {
     wheelpos=hit.point + WheelColFR.transform.up * WheelColFR.radius;
     } else
     {
      wheelpos =  WheelColFR.transform.position -WheelColFR.transform.up * WheelColFR.suspensionDistance ;
      }
      WheelColFRTransform.position - wheelpos;
      }


       function OnGUI()
      {
       var speedFactor : float = 0.0;
       speedFactor = currentSpeed / maxSpeed;
       if(currentSpeed >= 0)
       GUIUtility.RotateAroundPivot (180 * speedFactor, Vector2 (Screen.width - 150, Screen.height));
       else
       GUIUtility.RotateAroundPivot (180 * -speedFactor, Vector2 (Screen.width - 150, Screen.height));

       GUI.DrawTexture (Rect(Screen.width - 310, Screen.height -150,250,250), needleSpeedMeter);       
      
         }

      
       










