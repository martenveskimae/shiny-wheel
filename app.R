library(shiny)

df = data.frame(deeds = c("Hug", "Smile", "Call", "Compliment", "Positive note", "Thank someone", "Donate", "Laugh", "Listen", "Say YES", "Be grateful", "Love"),
                motivation = c("Today you should hug someone! You can make someone's day by just giving them nice warm bear hug. It can be a family member, colleague, friend or a random stranger. But remember not do hug someone you don't know without asking for permission first.",
                               "Today you should smile to a stranger! You can brighten someone's day just by smiling at them on the street.",
                               "Today you should call an old friend! This friend may even be your mom, granddad or sister that you haven't spoken to for a while. Make their day by showing that you remembering them!",
                               "Today you should give a compliment! Let colleague know that their hard work is being noticed. Let the guy with the cool bike know that you like his ride. Or compliment someone online.",
                               "Today you should leave a positive note! Leave a positive note for a family member or a friend or a stranger. Maybe hide it from the sight so it will be a suprise. ",
                               'Today you should give thanks. Let the barista know that you appriciate his work. Say "Thank you" to your partner for being amazing.',
                               "Today you should donate. You can donate old cloths or things. Or you can help someone with little money. Or donate your time for great cause.",
                               "Today you should make someone laugh. Tell a joke or pun at work. Make funny impressions to kids. Or send a hilarious picture to a friend.",
                               "Today you sould listen. Ask a friend (maybe in trouble) how are they doing and if they want to talk listen. Give your time to listen.",
                               'Today you should say "Yes" to someone. Maybe it is friend that wants to meet. Maybe its stranger asking for help. Maybe it is your kid that wants to play with you. Say YES!',
                               "Today you should be grateful. You should write down 3 to 5 things that you are grateful for.",
                               "Today you should love. Let at least one person know that you love him/her and maybe even give a reason. This will make their day!"),
                images = c("hug.jpeg", "smile.jpeg", "call.jpeg", "compliment.jpeg", "positive_note.jpeg", "thank_someone.jpeg", "donate.jpeg", "laugh.jpeg", "listen.jpeg", "say_yes.jpeg", "be_grateful.jpeg", "love.jpeg"))

ui = fluidPage(
  includeCSS("www/custom.css"),
  tags$head(tags$script(src="http://d3js.org/d3.v4.min.js")),
  tags$head(tags$script(src="wheel.js")),
  
  h2("Shiny Wheels"),
  sliderInput("deeds.nr", "Number of deeds:", min = 1, max = 12, value = 6),
  HTML(paste("<link href='http://fonts.googleapis.com/css?family=Courgette' rel='stylesheet' type='text/css'>
              <button id='wheelButton' onclick='spin()'>Spin</button>
              <div id='wheel'></div>
              <div id='results' style='width: 700px'></div>
              <script>init()</script>")),
  uiOutput("spinner")
)

server = function(input, output, session){
  
  update = eventReactive(input$deeds.nr,{
     filtered.df = df[1:input$deeds.nr,]
     session$sendCustomMessage(type="df", filtered.df)
   })
  
  output$spinner = renderUI({
    update()
  })
  
}
shinyApp(ui = ui, server = server)

