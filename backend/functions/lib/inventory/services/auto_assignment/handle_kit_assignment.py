








from lib.programs.services.fetch_program import FetchPrograms
from lib.programs.services.calculate_program_kit_needs import CalculateProgramKitNeeds



class HandleKitAssignment:


    @staticmethod
    def set_num_kits_needed(programs):
        #Get Demand
        for program in programs:
            num_kits_needed = CalculateProgramKitNeeds.calculate_kit_needs(program)
            if num_kits_needed:
                program.num_kits_needed = num_kits_needed
    
    
    @staticmethod
    def assign_kits_to_programs():
        
        upcoming_programs = FetchPrograms.get_all_upcoming_programs()
        HandleKitAssignment.set_num_kits_needed()

        

        
               
        #From program and demand calculate which kits needed
        



        #Get Supply
        

        
        pass