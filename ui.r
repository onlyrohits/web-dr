library(shiny)

shinyUI (pageWithSidebar  	
         (	
             headerPanel ("Differences Between Champions and Runnerups"),
  
             sidebarPanel 
             (           selectInput ("variable", "Variable:",
                                      list("Winner" = "winner", 
                                           "Error" = "error", 
                                           "Total" = "total")
             ),
            
             checkboxInput ("outliers", "Show outliers", FALSE) 
             ),
             
             mainPanel
             (     h3(textOutput("caption")),
                   plotOutput("tennisPlot")
             )
              
             
           



))
