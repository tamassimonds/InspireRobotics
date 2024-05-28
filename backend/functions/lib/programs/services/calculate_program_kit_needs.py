


from math import ceil


from lib.programs.programs import Program


from lib.programs.services.fetch_program_info import FetchProgramInfo


class CalculateProgramKitNeeds:
    
    @staticmethod
    def calculate_kit_needs(program: Program):
        """
        Calculate based off number of students. if that doesn't exist use num classes
        """

        if program.num_students:
            return ceil(program.num_students/25)
        else:
            numClasses = len(FetchProgramInfo.fetch_all_classes_in_program(program.id))

            if numClasses == 0:
                return None

            return numClasses





        pass