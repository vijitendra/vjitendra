
var path : Array;

var pathGroupup : Transform;
var maxSteer : float = 15.0;
var WheelFL : WheelCollider;
var WheelFR : WheelCollider;
var WheelRL : WheelCollider;
var WheelRR : WheelCollider;
var currentPathObj : int;
var distFromPath : float = 20;
var maxTorque : float = 50;
var currentSpeed : float;
var topSpeed : float = 150;
var decellarationSpeed : float = 10;
var sensorLength : float = 5;
var frontSensorStartPoint : float = 5;
var frontSensorSideDist : float = 5;

var breakingMesh : Renderer;
var idealBreakLight : Material;
var activeBreakLight : Material;
var isBreaking : boolean;
var inSector : boolean;

var frontSensorsAngle : float =30;
var sideWaySensorLength : float = 5;
var avoidSpeed : float  = 10;
private var flag : int = 0; 
var reversing : boolean = false;
var reverCounter : float = 0.0;
var waitToReverse : float =2.0;
var reverFor : float = 1.5;
var respawnWait : float = 5;
var respawnCounter : float = 0.00;

 function Start()
 {
GetComponent.<Rigidbody>().centerOfMass.y = -0.7;
GetComponent.<Rigidbody>().centerOfMass.z = 0.1;
 GetPath ();
 }
 
 function GetPath ()
 {
 var path_objs : Array = pathGroupup.GetComponentsInChildren(Transform);
path = new Array ();

for (var path_obj : Transform in path_objs)
{
if (path_obj != pathGroupup)
path [path.length] = path_obj;
}
}

function Update ()
{
if (flag ==0)
Move ();
GetSteer ();
Sensors();
BreakingEffect();
Respawn();
}

function GetSteer()
{
var steerVector : Vector3 = transform.InverseTransformPoint (Vector3(path[currentPathObj].position.x,transform.position.y,path[currentPathObj].position.z));
var newSteer : float = maxSteer * (steerVector.x / steerVector.magnitude);

WheelFL.steerAngle = newSteer;
WheelFR.steerAngle = newSteer;

if (steerVector.magnitude <= distFromPath)
{
currentPathObj++;
if (currentPathObj >= path.length)
currentPathObj = 0;
} 
}

function Move()
{
currentSpeed = 2* (22/7) * WheelRL.radius*WheelRL.rpm * 60 / 1000;
currentSpeed = Mathf.Round (currentSpeed);
if (currentSpeed <= topSpeed && !inSector)
{
if (!reversing)
{
WheelRL.motorTorque = maxTorque;
WheelRR.motorTorque = maxTorque;
}
else
{
WheelRL.motorTorque = -maxTorque;
WheelRR.motorTorque = -maxTorque;
}

WheelRL.brakeTorque = 0;
WheelRR.brakeTorque = 0;
}


else if (! inSector)
{
WheelRL.motorTorque = 0;
WheelRR.motorTorque = 0;
WheelRL.brakeTorque = decellarationSpeed;
WheelRR.brakeTorque = decellarationSpeed;
}
}

function Sensors()
{
flag = 0;
var avoidSenstivity : float =0;
var pos : Vector3;
var hit : RaycastHit;
var rightAngle = Quaternion.AngleAxis(frontSensorsAngle,transform.up)*transform.forward;
var leftAngle = Quaternion.AngleAxis(-frontSensorsAngle,transform.up)*transform.forward;



pos = transform.position;
pos += transform.forward * frontSensorStartPoint;

//breaking Sensor
if(Physics.Raycast(pos,transform.forward,hit,sensorLength))
{
if (hit.transform.tag != "Terrain")
{
flag++;
WheelRL.brakeTorque = decellarationSpeed;
WheelRR.brakeTorque = decellarationSpeed;
Debug.DrawLine(pos,hit.point,Color.red);
}
}
 else
 {
WheelRL.brakeTorque = 0;
WheelRR.brakeTorque = 0;
}



//front Straight right Sensor
pos += transform.right * frontSensorSideDist;
if(Physics.Raycast(pos,transform.forward,hit,sensorLength))
{
if (hit.transform.tag != "Terrain")
{
flag++;
avoidSenstivity -= 1;
Debug.Log("Avoiding");
Debug.DrawLine(pos,hit.point,Color.white);
}
}

else if(Physics.Raycast(pos,rightAngle,hit,sensorLength))
{
if (hit.transform.tag != "Terrain")
{
avoidSenstivity -= 0.5;
flag++;
Debug.DrawLine(pos,hit.point,Color.white);
}
}


//front Straight left Sensor
pos = transform.position;
pos += transform.forward * frontSensorStartPoint;
pos -= transform.right * frontSensorSideDist;
if(Physics.Raycast(pos,transform.forward,hit,sensorLength))
{
if (hit.transform.tag != "Terrain")
{
flag++;
avoidSenstivity += 0.5;
Debug.Log("Avoiding");
Debug.DrawLine(pos,hit.point,Color.white);
}
}

else if(Physics.Raycast(pos,leftAngle,hit,sensorLength))
{
if (hit.transform.tag != "Terrain")
{
flag++;
avoidSenstivity += 0.5;
Debug.DrawLine(pos,hit.point,Color.white);
}
}
//right sideWay Sensor
if(Physics.Raycast(transform.position,transform.right,hit,sideWaySensorLength ))
{
if (hit.transform.tag != "Terrain")
{
flag++;
avoidSenstivity -= 0.5;
Debug.DrawLine(transform.position,hit.point,Color.white);
}}
//left sideWay Sensor
if(Physics.Raycast(transform.position,-transform.right,hit,sideWaySensorLength ))
{
if (hit.transform.tag != "Terrain")
{
flag++;
avoidSenstivity += 0.5;
Debug.DrawLine(transform.position,hit.point,Color.white);
}
}
//frontmid sensor
if (avoidSenstivity == 0){
if(Physics.Raycast(pos,transform.forward,hit,sensorLength))
{if (hit.transform.tag != "Terrain")
{
if (hit.normal.x < 0)
avoidSenstivity = 1;
else
avoidSenstivity = -1;
Debug.DrawLine(pos,hit.point,Color.white);
}
}
}

if( rigidbody.velocity.magnitude < 2 && !reversing)
{
reverCounter += Time.deltaTime;
if (reverCounter >= waitToReverse)
{
reverCounter = 0;
reversing = true;
}
}
else if (!reversing){
reverCounter = 0;
}
if (reversing)
{
avoidSenstivity *= -1;
reverCounter += Time.deltaTime;
if (reverCounter >= reverFor)
{
reverCounter = 0;
reversing = false;
}
}


if (flag != 0)
AvoidSteer (avoidSenstivity);
}

function AvoidSteer (senstivity : float)
{
WheelFL.steerAngle = avoidSpeed * senstivity;
WheelFR.steerAngle = avoidSpeed * senstivity;
}
function Respawn (){
if (rigidbody.velocity.magnitude < 2)
{
respawnCounter += Time.deltaTime;
if(respawnCounter >= respawnWait){
if (currentPathObj == 0){
transform.position = path[path.length -1].position;
}
else{
transform.position = path[currentPathObj - 1].position;
}
respawnCounter = 0;
transform.localEulerAngles.z = 0;
}
}
}

function BreakingEffect()
{
if ( isBreaking)
{
breakingMesh.material = activeBreakLight;
}
else{
breakingMesh.material = idealBreakLight;
}
}


