from openai import OpenAI
import time
import os

# ==============================
# OpenAI Setup
# ==============================

client = OpenAI(
    api_key="API_KEY"
)

# ==============================
# Character & Setting Anchors
# ==============================
# Keeping these consistent across every prompt so Sora
# treats them as the same person in the same place.
 
CHARACTER = """A young professional woman in her early 30s with dark hair
pulled back, wearing a fitted navy blazer over a white shirt, minimal
jewelry. She carries herself with calm confidence."""
 
OFFICE = """A modern open-plan tech office with floor-to-ceiling windows,
warm natural light, light wood desks, and a few green plants. The same
office throughout the entire day."""


# ==============================
# Video Scenes
# ==============================

scenes = [
    {
        "filename": "scene1_.mp4",
        "prompt": f"""
        Opening shot. Early morning, the office is mostly empty.
 
        {CHARACTER}
 
        She walks through the glass doors of {OFFICE}, carrying a white
        coffee mug. She settles at her desk near the windows, opens her
        laptop, and scans her calendar — a full day of meetings, deadlines,
        and check-ins. She takes a sip of coffee and pauses for a moment
        before the day takes over.
 
        Golden morning light, the calm before the storm. Smooth slow
        tracking shot following her from the door to her desk. Cinematic,
        realistic, high quality.
        """
    },
    {
        "filename": "scene2_.mp4",
        "prompt": f"""
        Continuing from the previous scene. The office has filled in.
 
        {CHARACTER}
 
        She stands up from the same desk we saw her sit down at, coffee mug
        still in hand, and walks over to a standing area where her team of
        six is gathering in a loose circle near a large wall-mounted screen
        showing a Kanban board with colored task cards. She listens as a
        developer gives a quick update, then responds with a clear, brief
        direction. The team nods. The energy is focused and efficient — this
        is a fifteen-minute meeting, not an hour-long one.
 
        Same office, {OFFICE}, mid-morning light now brighter. Medium shot
        capturing the group dynamic. Cinematic, realistic.
        """
    },
    {
        "filename": "scene3_.mp4",
        "prompt": f"""
        Right after the standup. She returns to her desk.
 
        {CHARACTER}
 
        Back at the same desk from scene one, coffee mug now half empty.
        She's focused, updating a project timeline on her laptop — dragging
        tasks, adjusting dates, typing notes. We see a close-up of her
        hands on the keyboard, then a wider shot of her expression: calm,
        methodical, thinking two steps ahead. A notification pops up on
        screen — a meeting in ten minutes.
 
        Same office, {OFFICE}, late morning light. Mix of close-up and
        medium shots. Cinematic, realistic, professional.
        """
    },
    {
        "filename": "scene4_.mp4",
        "prompt": f"""
        She transitions directly from planning into the stakeholder call.
 
        {CHARACTER}
 
        Same desk. She puts on a headset, straightens slightly, and joins
        a video call — her laptop screen shows a grid of four faces. She's
        presenting a project update, gesturing lightly as she explains a
        timeline. Her tone is confident but approachable. At one point she
        glances down at her notes, then back to camera with a clear answer.
        The call feels real — she's not performing, she's communicating.
 
        Same office, {OFFICE}, midday light. Over-the-shoulder and
        medium shots alternating. Cinematic, realistic.
        """
    },
    {
        "filename": "scene5_.mp4",
        "prompt": f"""
        Immediately after hanging up the client call, a developer
        approaches her desk.
 
        {CHARACTER}
 
        She takes off her headset as a team member walks up looking
        concerned. He turns his laptop toward her showing a problem. She
        listens carefully, asks a question, then they both look at the
        wall-mounted Kanban board from the standup scene. She moves a
        few task cards around, reprioritizing. The developer nods, visibly
        relieved. She gives a reassuring look — this is handled.
 
        Same office, {OFFICE}, early afternoon light. Medium two-shot
        showing both people. Cinematic, realistic.
        """
    },
    {
        "filename": "scene6_.mp4",
        "prompt": f"""
        Later that afternoon. Energy in the office is high.
 
        {CHARACTER}
 
        She's standing at a glass whiteboard with three teammates — a
        designer holding a tablet, two developers. They're sketching out
        a solution diagram together, building on the problem that was
        flagged in the previous scene. She draws a quick flow on the board,
        a teammate adds to it, they go back and forth. It feels like real
        creative problem-solving, not a staged meeting.
 
        Same office, {OFFICE}, warm afternoon light coming through the
        windows at a lower angle now. Medium wide shot. Cinematic,
        realistic, energetic.
        """
    },
    {
        "filename": "scene7_.mp4",
        "prompt": f"""
        End of the day. The office is quieter again, coming full circle
        from the morning.
 
        {CHARACTER}
 
        She's back at her desk — the same desk from scene one. The coffee
        mug is empty now, pushed to the side. She reviews a project
        dashboard showing green status indicators and completed milestones.
        A small, genuine smile — not celebration, just quiet satisfaction
        that today moved things forward. She closes her laptop slowly,
        grabs her mug, and stands up.
 
        Same office, {OFFICE}, golden hour light mirroring the morning
        but warmer and lower. The office is emptying out around her.
        Slow cinematic shot. Reflective, peaceful.
        """
    },
    {
        "filename": "scene8_.mp4",
        "prompt": f"""
        Final shot. She walks toward the same glass doors she entered
        through in scene one, now heading out.
 
        {CHARACTER}
 
        She pauses near the door, glances back at the office — the Kanban
        board, the whiteboard with the afternoon's diagrams still on it,
        her desk by the window. Then she walks through the doors. The
        camera holds on the empty office for a beat as the lights dim.
 
        Fade to a clean white screen. Text fades in: "Project Manager"
        in bold modern typography, with a subtle Prelude logo in the
        bottom corner.
 
        Same office, {OFFICE}, evening light fading. Slow, cinematic,
        contemplative. High quality.
        """
    }
]

# ==============================
# Generate Videos
# ==============================

for i, scene in enumerate(scenes):

    if os.path.exists(scene["filename"]):
        print(f"{scene['filename']} already exists, skipping...")
        continue

    print("\n==============================")
    print(f"Generating {scene['filename']}")
    print("==============================")


    video = client.videos.create(
        model="sora-2",
        prompt=scene["prompt"],
        seconds=8,
        size="1280x720"
    )


    print("Created video:", video.id)


    # Wait until finished
    while True:

        video = client.videos.retrieve(video.id)

        print("Status:", video.status)


        if video.status == "completed":
            break


        if video.status == "failed":
            print("Video generation failed")
            break


        time.sleep(10)



    if video.status == "completed":

        print("Downloading...")

        content = client.videos.download_content(video.id)

        with open(scene["filename"], "wb") as f:
            f.write(content.read())


        print(
            f"Saved {scene['filename']}"
        )


print("\nAll scenes completed!")
