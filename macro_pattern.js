var functional_Macro = {
    const macro = {
        commandList: [],
        add: (command) => macro.commandList.push(command),
        excute: () => macro.commandList.map(command => command.excute())
    }

    const eatRice = {
        excute: () => console.log('吃飯')
    }
    const sleep = {
        excute: () => console.log('睡覺')
    }
    const punch = {
        excute: () => console.log('打東東')
    }

    macro.add(eatRice);
    macro.add(sleep);
    macro.add(punch);
    macro.commandList;
    macro.excute();

}
